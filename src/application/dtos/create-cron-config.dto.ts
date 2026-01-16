import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCronConfigDto {
  @ApiProperty({
    description: 'Nombre único de la configuración',
    example: 'custom-sender',
  })
  name: string;

  @ApiProperty({
    description:
      'Expresión cron (formato: minutos horas día-mes mes día-semana)',
    example: '*/5 * * * *',
  })
  cronExpression: string;

  @ApiPropertyOptional({
    description: 'Si el cron está activo',
    default: true,
  })
  isActive?: boolean;
}
