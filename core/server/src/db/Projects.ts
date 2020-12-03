import {Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./Clients";
import {Group} from "./Groups";

@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @OneToOne(() => User)
    @JoinColumn()
    owner: User

    @OneToMany(() => Group, group => group.project, {
        nullable: true
    })
    groups: Group[]
}
