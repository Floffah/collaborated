import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({length: 512})
    access: string
}

@Entity()
export class GatewayConnection {
    @PrimaryGeneratedColumn()
    guid: number

    @OneToOne(() => User)
    @JoinColumn()
    user: User
}
