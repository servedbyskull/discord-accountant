import {
  AkairoClient,
  CommandHandler,
  InhibitorHandler,
  ListenerHandler,
} from "discord-akairo"
import { join } from "path"
import { Pool } from "mysql2/promise"
import { PREFIX } from "./config"

export class Accountant extends AkairoClient {
  commandHandler: CommandHandler
  listenerHandler: ListenerHandler
  inhibitorHandler: InhibitorHandler
  pool: Pool

  constructor(pool: Pool) {
    super()

    this.pool = pool

    this.commandHandler = new CommandHandler(this, {
      directory: join(__dirname, "commands"),
      prefix: PREFIX,
      blockBots: false,
    })

    this.listenerHandler = new ListenerHandler(this, {
      directory: join(__dirname, "listeners"),
    })
    this.commandHandler.useListenerHandler(this.listenerHandler)

    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler,
    })

    this.inhibitorHandler = new InhibitorHandler(this, {
      directory: join(__dirname, "inhibitors"),
    })
    this.commandHandler.useInhibitorHandler(this.inhibitorHandler)

    this.commandHandler.loadAll()
    this.listenerHandler.loadAll()
    this.inhibitorHandler.loadAll()
  }
}
