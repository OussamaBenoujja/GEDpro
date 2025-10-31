import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('organizations')
export class Organization {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    domain: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    logoUrl: string;

    @OneToMany(() => User, (user) => user.organization)
    users: User[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
