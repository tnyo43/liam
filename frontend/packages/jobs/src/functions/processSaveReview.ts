import { createClient } from '../libs/supabase'
import { SeverityEnum } from '../prompts/generateReview/reviewSchema'
import type { ReviewResponse } from '../types'

// Use SeverityEnum values type
type Severity = keyof typeof SeverityEnum.enum

export const processSaveReview = async (
  payload: ReviewResponse,
): Promise<{ success: boolean }> => {
  try {
    const supabase = createClient()
    const { data: pullRequest, error: pullRequestError } = await supabase
      .from('PullRequest')
      .select('*')
      .eq('id', payload.pullRequestId)
      .single()

    if (pullRequestError || !pullRequest) {
      throw new Error(
        `PullRequest not found: ${JSON.stringify(pullRequestError)}`,
      )
    }

    const now = new Date().toISOString()

    // create overall review
    const { data: overallReview, error: overallReviewError } = await supabase
      .from('OverallReview')
      .insert({
        projectId: payload.projectId,
        pullRequestId: pullRequest.id,
        reviewComment: payload.review.bodyMarkdown,
        branchName: payload.branchName,
        traceId: payload.traceId,
        updatedAt: now,
      })
      .select()
      .single()

    if (overallReviewError || !overallReview) {
      throw new Error(
        `Failed to create overall review: ${JSON.stringify(overallReviewError)}`,
      )
    }

    // Calculate scores based on feedback severity
    // Group feedbacks by category
    const feedbacksByCategory: Record<string, typeof payload.review.feedbacks> =
      {}

    // Use for...of instead of forEach
    for (const feedback of payload.review.feedbacks) {
      const kind = feedback.kind || 'Unknown'
      if (!feedbacksByCategory[kind]) {
        feedbacksByCategory[kind] = []
      }
      feedbacksByCategory[kind].push(feedback)
    }

    // Create review scores
    const reviewScores = Object.entries(feedbacksByCategory).map(
      ([category, feedbacks]) => {
        // Start with 10 points
        let score = 10

        // Calculate deductions based on feedback severity
        // Use for...of instead of forEach
        for (const feedback of feedbacks) {
          const severity = feedback.severity as Severity
          if (severity === SeverityEnum.enum.CRITICAL) {
            score -= 3
          } else if (severity === SeverityEnum.enum.WARNING) {
            score -= 1
          }
          // No deduction for POSITIVE feedback (no points subtracted)
        }

        // Ensure minimum score is 0
        score = Math.max(0, score)

        // Find the reason from the original scores if available
        const originalScore = payload.review.scores?.find(
          (s) => s.kind === category,
        )
        const reason =
          originalScore?.reason || 'Score calculated based on feedback severity'

        return {
          overallReviewId: overallReview.id,
          overallScore: score,
          category: mapCategoryEnum(category),
          reason,
          updatedAt: now,
        }
      },
    )

    const { error: reviewScoresError } = await supabase
      .from('ReviewScore')
      .insert(reviewScores)

    if (reviewScoresError) {
      throw new Error(
        `Failed to create review scores: ${JSON.stringify(reviewScoresError)}`,
      )
    }

    // create review issues
    const reviewIssues = payload.review.feedbacks.map((feedback) => ({
      overallReviewId: overallReview.id,
      category: mapCategoryEnum(feedback.kind),
      severity: feedback.severity,
      description: feedback.description,
      suggestion: feedback.suggestion,
      updatedAt: now,
    }))

    const { data: insertedIssues, error: reviewIssuesError } = await supabase
      .from('ReviewIssue')
      .insert(reviewIssues)
      .select('id')

    if (reviewIssuesError || !insertedIssues) {
      throw new Error(
        `Failed to create review issues: ${JSON.stringify(reviewIssuesError)}`,
      )
    }

    // create suggestion snippet
    const suggestionSnippet = payload.review.feedbacks
      .flatMap(
        (
          feedback: {
            suggestionSnippets: Array<{ filename: string; snippet: string }>
          },
          index: number,
        ) =>
          feedback.suggestionSnippets.map((snippet) =>
            insertedIssues[index]
              ? {
                  ...snippet,
                  reviewIssueId: insertedIssues[index].id,
                  updatedAt: now,
                }
              : null,
          ),
      )
      .filter(Boolean) as Array<{
      filename: string
      snippet: string
      reviewIssueId: number
      updatedAt: string
    }>

    const { data: insertedSuggestionSnippets, error: suggestionSnippetError } =
      await supabase
        .from('ReviewSuggestionSnippet')
        .insert(suggestionSnippet)
        .select('id')

    if (suggestionSnippetError || !insertedSuggestionSnippets) {
      throw new Error(
        `Failed to create suggestion snippet: ${JSON.stringify(suggestionSnippetError)}`,
      )
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error saving review:', error)
    throw error
  }
}

// Helper function to map category from review schema to CategoryEnum
const mapCategoryEnum = (
  category: string,
):
  | 'MIGRATION_SAFETY'
  | 'DATA_INTEGRITY'
  | 'PERFORMANCE_IMPACT'
  | 'PROJECT_RULES_CONSISTENCY'
  | 'SECURITY_OR_SCALABILITY' => {
  const mapping: Record<
    string,
    | 'MIGRATION_SAFETY'
    | 'DATA_INTEGRITY'
    | 'PERFORMANCE_IMPACT'
    | 'PROJECT_RULES_CONSISTENCY'
    | 'SECURITY_OR_SCALABILITY'
  > = {
    'Migration Safety': 'MIGRATION_SAFETY',
    'Data Integrity': 'DATA_INTEGRITY',
    'Performance Impact': 'PERFORMANCE_IMPACT',
    'Project Rules Consistency': 'PROJECT_RULES_CONSISTENCY',
    'Security or Scalability': 'SECURITY_OR_SCALABILITY',
    // Add fallback for unknown category
    Unknown: 'MIGRATION_SAFETY', // Default to MIGRATION_SAFETY for unknown categories
  }
  const result = mapping[category]
  if (!result) {
    console.warn(
      `Unknown category: ${category}, defaulting to MIGRATION_SAFETY`,
    )
    return 'MIGRATION_SAFETY'
  }
  return result
}
