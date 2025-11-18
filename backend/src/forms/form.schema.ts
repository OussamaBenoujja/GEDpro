import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum FieldType {
    TEXT = 'TEXT',
    NUMBER = 'NUMBER',
    EMAIL = 'EMAIL',
    FILE = 'FILE',
    DATE = 'DATE',
}

@Schema()
export class FormField {
    @Prop({ required: true })
    label: string;

    @Prop({ type: String, enum: FieldType, default: FieldType.TEXT })
    type: FieldType;

    @Prop({ default: false })
    required: boolean;
}

@Schema({ timestamps: true })
export class Form extends Document {
    @Prop({ required: true })
    title: string;

    @Prop()
    description: string;

    @Prop({ required: true })
    organizationId: string;

    @Prop({ type: [SchemaFactory.createForClass(FormField)], default: [] })
    fields: FormField[];

    @Prop({ default: false })
    isPublished: boolean;
}

export const FormSchema = SchemaFactory.createForClass(Form);
