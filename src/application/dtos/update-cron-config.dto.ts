import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCronConfigDto {
  @ApiPropertyOptional({
    description: 'Expresión cron (formato: minutos horas día-mes mes día-semana)',
    example: '* * * * *',
  })
  cronExpression?: string;

  @ApiPropertyOptional({
    description: 'Si el cron está activo',
  })
  isActive?: boolean;
}
