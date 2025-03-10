import prisma from "../../../../prismaClient";
import { SupportFormDTO } from "../../domain/dtos/form.dtos";

export class FormRepository {
  async submitSupportForm(formData: SupportFormDTO) {
    console.log(formData);

  }
}
