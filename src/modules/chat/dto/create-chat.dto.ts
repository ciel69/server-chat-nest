import { Min } from 'class-validator';
import { CreateChatInput } from '../typedefs/index';

export class CreateChatDto extends CreateChatInput {
  @Min(1)
  text: string;
}