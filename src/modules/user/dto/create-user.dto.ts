import { Min } from 'class-validator';
import { CreateChatInput } from '../typedefs/index';

export class CreateUserDto extends CreateChatInput {
  @Min(1)
  name: string;
}