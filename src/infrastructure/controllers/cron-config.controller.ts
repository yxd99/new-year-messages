import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import {
  CreateCronConfigUseCase,
  GetCronConfigsUseCase,
  UpdateCronConfigUseCase,
} from '@application/use-cases/index.js';
import {
  CreateCronConfigDto,
  UpdateCronConfigDto,
} from '@application/dtos/index.js';
import { MessageSenderCron } from '@infrastructure/cron/index.js';

@ApiTags('cron-config')
@Controller('cron-config')
export class CronConfigController {
  constructor(
    private readonly createCronConfigUseCase: CreateCronConfigUseCase,
    private readonly getCronConfigsUseCase: GetCronConfigsUseCase,
    private readonly updateCronConfigUseCase: UpdateCronConfigUseCase,
    private readonly messageSenderCron: MessageSenderCron,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear configuración de cron' })
  @ApiResponse({ status: 201, description: 'Configuración creada' })
  @ApiResponse({
    status: 409,
    description: 'Ya existe una configuración con ese nombre',
  })
  async create(@Body() dto: CreateCronConfigDto) {
    return this.createCronConfigUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las configuraciones de cron' })
  @ApiResponse({ status: 200, description: 'Lista de configuraciones' })
  async findAll() {
    return this.getCronConfigsUseCase.execute();
  }

  @Get('active')
  @ApiOperation({ summary: 'Listar configuraciones activas' })
  @ApiResponse({ status: 200, description: 'Lista de configuraciones activas' })
  async findActive() {
    return this.getCronConfigsUseCase.executeActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener configuración por ID' })
  @ApiParam({ name: 'id', description: 'ID de la configuración (UUID)' })
  @ApiResponse({ status: 200, description: 'Configuración encontrada' })
  @ApiResponse({ status: 404, description: 'Configuración no encontrada' })
  async findOne(@Param('id') id: string) {
    return this.getCronConfigsUseCase.executeById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar configuración de cron' })
  @ApiParam({ name: 'id', description: 'ID de la configuración (UUID)' })
  @ApiResponse({ status: 200, description: 'Configuración actualizada' })
  @ApiResponse({ status: 404, description: 'Configuración no encontrada' })
  async update(@Param('id') id: string, @Body() dto: UpdateCronConfigDto) {
    const updated = await this.updateCronConfigUseCase.execute(id, dto);

    if (updated.name === 'message-sender' && dto.cronExpression) {
      await this.messageSenderCron.updateCronExpression(dto.cronExpression);
    }

    if (updated.name === 'message-sender' && dto.isActive !== undefined) {
      await this.messageSenderCron.toggleCron(dto.isActive);
    }

    return updated;
  }
}
