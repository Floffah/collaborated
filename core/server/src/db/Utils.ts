import {Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {Project} from "./Projects";

@Entity()
export class RequestLog {
    @PrimaryColumn()
    origin: string

    @Column()
    system: "api"

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
