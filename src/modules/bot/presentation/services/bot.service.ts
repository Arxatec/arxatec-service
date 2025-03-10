import { BotApi } from "../../data/api/bot.api";

export class BotService {
  constructor(private botRepository: BotApi) {}

  async sendMessage(message: string) {
    return this.botRepository.sendMessage(message);
  }
}
