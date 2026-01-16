import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiSecurity,
} from '@nestjs/swagger';
import {
  CreateMessageUseCase,
  GetMessagesUseCase,
  UpdateMessageUseCase,
  DeleteMessageUseCase,
  SendMessageUseCase,
  BulkCreateMessagesUseCase,
} from '@application/use-cases/index.js';
import {
  CreateMessageDto,
  UpdateMessageDto,
  BulkCreateMessagesDto,
  BulkCreateMessagesResponseDto,
} from '@application/dtos/index.js';
import { MessageStatus } from '@domain/enums/index.js';

@ApiTags('messages')
@ApiSecurity('api-token')
@Controller('messages')
export class MessageController {
  constructor(
    private readonly createMessageUseCase: CreateMessageUseCase,
    private readonly getMessagesUseCase: GetMessagesUseCase,
    private readonly updateMessageUseCase: UpdateMessageUseCase,
    private readonly deleteMessageUseCase: DeleteMessageUseCase,
    private readonly sendMessageUseCase: SendMessageUseCase,
    private readonly bulkCreateMessagesUseCase: BulkCreateMessagesUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo mensaje' })
  @ApiResponse({ status: 201, description: 'Mensaje creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'API Token inválido o no proporcionado' })
  async create(@Body() dto: CreateMessageDto) {
    return this.createMessageUseCase.execute(dto);
  }

  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear múltiples mensajes en bulk' })
  @ApiResponse({
    status: 201,
    description: 'Mensajes creados',
    type: BulkCreateMessagesResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'API Token inválido o no proporcionado' })
  async createBulk(@Body() dto: BulkCreateMessagesDto): Promise<BulkCreateMessagesResponseDto> {
    return this.bulkCreateMessagesUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los mensajes' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: MessageStatus,
    description: 'Filtrar por estado',
  })
  @ApiResponse({ status: 200, description: 'Lista de mensajes' })
  @ApiResponse({ status: 401, description: 'API Token inválido o no proporcionado' })
  async findAll(@Query('status') status?: MessageStatus) {
    if (status) {
      return this.getMessagesUseCase.executeByStatus(status);
    }
    return this.getMessagesUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener mensaje por ID' })
  @ApiParam({ name: 'id', description: 'ID del mensaje (UUID)' })
  @ApiResponse({ status: 200, description: 'Mensaje encontrado' })
  @ApiResponse({ status: 401, description: 'API Token inválido o no proporcionado' })
  @ApiResponse({ status: 404, description: 'Mensaje no encontrado' })
  async findOne(@Param('id') id: string) {
    return this.getMessagesUseCase.executeById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar mensaje' })
  @ApiParam({ name: 'id', description: 'ID del mensaje (UUID)' })
  @ApiResponse({ status: 200, description: 'Mensaje actualizado' })
  @ApiResponse({ status: 401, description: 'API Token inválido o no proporcionado' })
  @ApiResponse({ status: 404, description: 'Mensaje no encontrado' })
  async update(@Param('id') id: string, @Body() dto: UpdateMessageDto) {
    return this.updateMessageUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar mensaje' })
  @ApiParam({ name: 'id', description: 'ID del mensaje (UUID)' })
  @ApiResponse({ status: 204, description: 'Mensaje eliminado' })
  @ApiResponse({ status: 401, description: 'API Token inválido o no proporcionado' })
  @ApiResponse({ status: 404, description: 'Mensaje no encontrado' })
  async remove(@Param('id') id: string) {
    await this.deleteMessageUseCase.execute(id);
  }

  @Post(':id/send')
  @ApiOperation({ summary: 'Enviar mensaje manualmente' })
  @ApiParam({ name: 'id', description: 'ID del mensaje (UUID)' })
  @ApiResponse({ status: 200, description: 'Mensaje enviado' })
  @ApiResponse({ status: 401, description: 'API Token inválido o no proporcionado' })
  @ApiResponse({ status: 404, description: 'Mensaje no encontrado' })
  @ApiResponse({ status: 500, description: 'Error al enviar' })
  async send(@Param('id') id: string) {
    return this.sendMessageUseCase.execute(id);
  }
}
