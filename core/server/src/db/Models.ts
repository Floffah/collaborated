import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";

export class User_Settings {
    @Column({nullable: true})
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

    @Column({length: 512})
    access: string

    @Column(() => User_Settings)
    settings: User_Settings
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
}
