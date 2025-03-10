import { FormRepository } from "../../data/repository/form.repository";
import { SupportFormDTO } from "../../domain/dtos/form.dtos";

export class FormService {
  constructor(private readonly formRepository: FormRepository) {}
  async submitSupportForm(formData: SupportFormDTO) {
    return this.formRepository.submitSupportForm(formData);
  }
}
