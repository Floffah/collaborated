import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./Clients";
import { Project } from "./Projects";

@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToOne(() => User)
    @JoinColumn()
    administrator: User;

    @ManyToMany(() => User, (user) => user.groups, {
        cascade: true,
    })
    @JoinTable()
    users: User[];

    @ManyToOne(() => Project, (project) => project.groups, {
        nullable: true,
    })
    project: Project;
}
