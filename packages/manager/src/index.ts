import { program } from "commander";
import { serviceCmd } from "./cmds/service";
import debug from "debug";

debug.enable("manager:*");

program.description("Collaborateds service manager").version("0.0.1");

program
    .command("service")
    .description(
        "The command that runs the service. Must be kept running so this should probably be ran in the background by a system startup process.",
    )
    .action(() => serviceCmd());

program.parse(process.argv);
