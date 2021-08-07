# archon

## Build Through CLI

0. Run `npm install`

1. Run [Fitbit Simulator](https://simulator-updates.fitbit.com/download/latest/win)
2. Log into CLI `npx fitbit`  
   - CLI should now display `fitbit$`
3. Connect the Fitbit Simulator to CLI  
  3.1 `fitbit$ connect device`  
  3.2 `fitbit$ connect phone`
4. Build and Install  
  4.1 `fitbit$ bi`  
  4.2 `y` to use the default build script
    - The simulator should now display the clock face
    - The resulting built file is /build/app.fba