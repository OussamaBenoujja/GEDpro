import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Form } from './form.schema';

@Injectable()
export class FormsService {
    constructor(
        @InjectModel(Form.name)
        private formModel: Model<Form>,
    ) { }

    async create(data: Partial<Form>, organizationId: string): Promise<Form> {
        const newForm = new this.formModel({
            ...data,
            organizationId,
        });
        return newForm.save();
    }

    async findAll(organizationId: string): Promise<Form[]> {
        return this.formModel.find({ organizationId }).exec();
    }

    async findOne(id: string, organizationId: string): Promise<Form> {
        const form = await this.formModel.findOne({ _id: id, organizationId }).exec();
        if (!form) {
            throw new NotFoundException('Form not found');
        }
        return form;
    }

    async delete(id: string, organizationId: string): Promise<void> {
        const result = await this.formModel.deleteOne({ _id: id, organizationId }).exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException('Form not found');
        }
    }

    async findPublished(): Promise<Form[]> {
        return this.formModel.find({ isPublished: true }).exec();
    }

    async findPublishedOne(id: string): Promise<Form> {
        const form = await this.formModel.findOne({ _id: id, isPublished: true }).exec();
        if (!form) throw new NotFoundException('Form not found or not published');
        return form;
    }
}
