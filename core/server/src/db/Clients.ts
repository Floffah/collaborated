import {Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import { Group } from "./Groups";
import {Project} from "./Projects";

export class User_Settings {
    @Column({default: false})
    left_handed: boolean

    @Column({default: "dark"})
    theme: string
}

export class User_Rates {
    @Column({nullable: true})
    project_created: Date

    @Column({nullable: true})
    group_created: Date
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    email: string

    @Column()
    password: string

    @ManyToMany(() => Group, group => group.users)
    groups: Group[]

    @ManyToOne(() => Project, group => group.owner)
    projectsOwned: Project[]

    @Column(() => User_Settings)
    settings: User_Settings

    @Column(() => User_Rates)
    rates: User_Rates

    @Column({length: 512, nullable: true})
    access: string
}

@Entity()
export class GatewayConnection {
    @PrimaryGeneratedColumn()
    guid: number

    @OneToOne(() => User)
    @JoinColumn()
    user: User

    @Column({nullable: true, default: false})
    authed: boolean

    @Column({default: [], type: "text"})
    listen: string[]
}
