import { IsString, IsOptional, Matches, MinLength } from 'class-validator';

export class CreateGenreDto {
  @IsString() @MinLength(2) name: string;

  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must be lowercase letters, numbers and hyphens (e.g. science-fiction)',
  })
  slug?: string;
}