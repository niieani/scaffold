- [ ] allow composite modules custom config
- [ ] for this one use declarations only emit (since TS is compiled)
- [ ] also emit declarations to 'src'
- [ ] gitignore `src/**/*.d.ts`
- [ ] rename from beemo-build-tools to scaffold
- [ ] add build: false for projects that don't need building
- [ ] add .vscode/extensions.json (see below)
- [ ] typescript should have 2 configs that have different excludes (for test files, and for src), and then use them accordingly
- [ ] remove "\*.d.ts", from typescript's excludes
- [ ] instead of a CLI generator/scaffold, .gitignore and other static files should also be drivers
- [ ] possibly move out of beemo into a custom tool (possibly based on a yarn plugin?) due to its complexity, limitations and instability
  - [ ] files should be generates (scaffold) with the context of the tool available (config.settings)
  - [ ] resolving config should ideally be synchronous so it can be used directly in config files for simplicity
  - [ ] use `yarn workspaces foreach` instead of re-creating the logic
  - [ ] instead of config's `node: true` it should be the opposite, `browser: true`, because you can have libraries that are for node and browser at the same time, so you compile them without support of browser
  - [ ] 2 modes
    - generate config from template using settings (run as `yarn` pre-run hook)
    - dynamic config that is just a reference (for those tools supporting configs written in JS, or purely using CLI arguments that can be generated)

example `.vscode/extensions.json`

```json
{
  "recommendations": ["dbaeumer.vscode-eslint", "esbenp.prettier-vscode"]
}
```
