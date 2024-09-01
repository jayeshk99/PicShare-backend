import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { PostEntity } from './post.entity';
import { FavouriteEntity } from './favourite.entity';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @Column({ name: 'user_name' })
  userName: string;

  @OneToMany(() => UserEntity, (user) => user.posts)
  posts: PostEntity[];

  @OneToMany(() => UserEntity, (user) => user.favourites)
  favourites: FavouriteEntity[];
}
