import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Nestled Schema for Contact
@Schema({ _id: false })
class ContactInfo {
    @Prop() linkedin?: string;
    @Prop() website?: string;
}

// Nestled Schema for Experience
@Schema({ _id: false })
class Experience {
    @Prop() title?: string;
    @Prop() company?: string;
    @Prop() startDate?: string;
    @Prop() endDate?: string;
    @Prop() description?: string;
}

// Nestled Schema for Education
@Schema({ _id: false })
class Education {
    @Prop() degree?: string;
    @Prop() institution?: string;
    @Prop() year?: string;
}

@Schema({ timestamps: true })
export class DocMetadata extends Document {
    @Prop({ required: true })
    filename: string;

    @Prop({ required: true })
    path: string;

    @Prop({ required: true })
    mimetype: string;

    @Prop({ required: true })
    size: number;

    @Prop({ required: true })
    candidateId: string;

    @Prop({ required: true })
    organizationId: string;

    @Prop()
    extractedText: string;

    // --- New Structured Fields (AI Parser) ---

    @Prop({ type: ContactInfo })
    contact?: ContactInfo;

    @Prop()
    summary?: string;

    @Prop([String])
    skills: string[];

    @Prop({ type: [Experience] })
    experience?: Experience[];

    @Prop({ type: [Education] })
    education?: Education[];
}

export const DocMetadataSchema = SchemaFactory.createForClass(DocMetadata);
