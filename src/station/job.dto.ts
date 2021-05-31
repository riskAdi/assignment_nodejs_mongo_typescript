import { IsString, IsDate } from 'class-validator';

class CreateJobDto {
  @IsDate()
  public jobDateTime: Date;

  @IsString()
  public status: string;
}

export default CreateJobDto;
