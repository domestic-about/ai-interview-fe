const { spawn } = require("child_process");
const vite = spawn("npm", ["run", "dev"], { stdio: "inherit", shell: true });
const electron = spawn("electron", ["."], { stdio: "inherit", shell: true });

process.on("SIGINT", () => {
  vite.kill();
  electron.kill();
  process.exit();
});
