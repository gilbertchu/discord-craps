# discord-craps

Craps on Discord

## Up and running

You must create `config.json` in project root (see template.config.json).

- Test: `npm test`
- Test with REPL: `npm run test-repl`
- Live: `npm start`

## TODO

1. Integrate discord db into app
   - Saving settings
2. Timers, AFK handling
3. App readiness
   - Disable sit until client ready + db loaded
   - Disable roll while resolving actions
   - etc.

## Bugs

- Pass odds win amount displaying incorrectly
- hardway bet won/loss on incorrect number

### Considerations

- Shooter turns
- Denominator checking & auto bet/increment by units setting
- Graphics?
- Programmatic way to restrict bot to specific channel?
