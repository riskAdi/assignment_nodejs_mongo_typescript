import { IsString, IsInt, IsObject, IsDate } from 'class-validator';

class CreateStationDto {
  @IsInt()
  public id: number;

  @IsString()
  public name: string;

  @IsDate()
  public date: Date;

  @IsObject()
  public data: object;
}

export default CreateStationDto;
