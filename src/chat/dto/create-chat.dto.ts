import { Min } from 'class-validator';
import { CreateCatInput } from '../../graphql.schema';

export class CreateChatDto extends CreateCatInput {
  @Min(1)
  text: string;
}