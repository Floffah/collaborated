import {Column, Entity, Generated, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { Project } from "./Projects";

@Entity()
export class RequestLog {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    system: "api"

    @Column({nullable: true})
    origin: string

    @Column()
    amount: number
}

@Entity()
export class Invite {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    invite: string

    @ManyToOne(() => Project, proj => proj.invites, {nullable: true})
    project: Project
}