import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/bin/index.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
  outExtension({ format }) {
    return {
      js: `.${format}.mjs`,
    }
}
})