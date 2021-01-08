import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./Clients";
import { Group } from "./Groups";
import { Invite } from "./Utils";

@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => User, (user) => user.projectsOwned)
    @JoinColumn()
    owner: User;

    @OneToMany(() => Invite, (inv) => inv.invite)
    @JoinColumn()
    invites: Invite[];

    @ManyToMany(() => User, (user) => user.projects)
    @JoinTable()
    members: User[];

    @OneToMany(() => Group, (group) => group.project, {
        nullable: true,
    })
    groups: Group[];
}
