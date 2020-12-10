import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./Clients";
import {Group} from "./Groups";

@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @ManyToOne(() => User, user => user.projectsOwned)
    @JoinColumn()
    owner: User

    @OneToMany(() => Group, group => group.project, {
        nullable: true
    })
    groups: Group[]
}
