import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { PostEntity } from './post.entity';

@Entity({ name: 'favourite' })
export class FavouriteEntity extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'post_id' })
  postId: string;

  @ManyToOne(() => UserEntity, (user) => user.favourites)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => PostEntity, (post) => post.favourites)
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;
}
