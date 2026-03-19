import {
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsInt()
  @Min(1)
  id!: number;

  @IsString()
  @MinLength(2)
  title!: string;

  @IsString()
  @MinLength(2)
  description!: string;

  @IsInt()
  @Min(0)
  stockNo!: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price!: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  discountPrice!: number;
}
