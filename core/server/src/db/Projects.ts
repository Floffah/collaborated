import { Column, Entity, JoinTable, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./Clients";
import { Group } from "./Groups";

@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @OneToOne(() => User)
    @JoinTable()
    owner: User

    @OneToMany(() => Group, group => group.project, {
        nullable: true
    })
    groups: Group[]
}