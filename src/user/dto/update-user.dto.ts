import { PartialType } from '@nestjs/swagger';
import { CreateBookDto } from './create-user.dto';

export class UpdateBookDto extends PartialType(CreateBookDto) {}
