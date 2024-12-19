import { describe, expect, it } from 'vitest'
import { compressToUTF16, decompressFromUTF16 } from './compressionString'

describe('compressionString', () => {
  it('should compress and decompress a string correctly', async () => {
    const input = 'Hello, world!'
    const compressed = await compressToUTF16(input)
    const decompressed = await decompressFromUTF16(compressed)

    expect(compressed).toMatchInlineSnapshot(`" 鱸䣳짍퟉⡑⿏䧊ё ў"`)
    expect(decompressed).toBe(input)
  })

  it('should handle empty string', async () => {
    const input = ''
    const compressed = await compressToUTF16(input)
    const decompressed = await decompressFromUTF16(compressed)

    expect(compressed).toMatchInlineSnapshot(`" 鱸 Ā"`)
    expect(decompressed).toBe(input)
  })

  it('should handle long string', async () => {
    const input = 'a'.repeat(1000)
    const compressed = await compressToUTF16(input)
    const decompressed = await decompressFromUTF16(compressed)

    expect(compressed).toMatchInlineSnapshot(`" 鱸䱋Ԝ患ఔw豈竘ø"`)
    expect(decompressed).toBe(input)
  })

  it('should handle special characters', async () => {
    const input = 'こんにちは、世界！'
    const compressed = await compressToUTF16(input)
    const decompressed = await decompressFromUTF16(compressed)

    expect(compressed).toMatchInlineSnapshot(`"& 鱸ᬁ鎁苣ꮁ臣꾁胣隸闧膼똀愒"`)
    expect(decompressed).toBe(input)
  })

  it('should handle binary data', async () => {
    const input = String.fromCharCode(
      ...Array.from({ length: 256 }, (_, i) => i),
    )
    const compressed = await compressToUTF16(input)
    const decompressed = await decompressFromUTF16(compressed)

    expect(decompressed).toBe(input)
  })
})
