import Discord from "discord.js";
import path from "path";
import FS from "fs";
import { prefix, token, channelID } from "../config.json";
import { BASE_DIR } from "../constants";
const client = new Discord.Client();

const getCommands = (): string[] => {
  const cmds: string[] = [];
  const dir = path.join(BASE_DIR, "src", "commands");
  FS.readdir(dir, (err, files) => {
    if (!err) {
      files.forEach((file) => cmds.push(file.replace(".ts", "")));
    }
  });
  return cmds;
};

const commands: string[] = getCommands();

client.once("ready", () => {
  console.log("Suggestion Bot running, DO NOT CLOSE!");
});

client.on("message", (msg) => {
  if (msg.channel.id === channelID && msg.content.startsWith(prefix)) {
    let args = msg.content.split(" ");
    const cmd = args[0].substring(1, args[0].length);

    if (commands.includes(cmd)) {
      args.splice(0, 1);
      const useCommand = require(path.join(
        BASE_DIR,
        "src",
        "commands",
        `${cmd}.ts`
      ));
      useCommand(msg, args);
    }
  }
});

client.login(token);
