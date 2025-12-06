import { readConfig, setUser } from "./config";

function main() {
  setUser("lane");
  const config = readConfig();
  console.log(config);
}

main();
