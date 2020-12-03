import {Column, Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import { Group } from "./Groups";

export class User_Settings {
    @Column({default: false})
    left_handed: boolean

    @Column({default: "dark"})
    theme: string
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

    @Column(() => User_Settings)
    settings: User_Settings

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
