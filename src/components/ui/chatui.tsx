'use client';

import { useState, useEffect, useCallback } from 'react';
import Input from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Reply } from "lucide-react";
import { toast } from 'react-toastify';
import io from "socket.io-client";
import { useSession } from '@/context/SessionContext';

interface Comment {
  id: number;
  userId: number;
  eventId: number;
  commentText: string;
  parentId: number | null;
  username: string;
  replies?: Comment[];
}

interface EventCommentsProps {
  eventId: number;
  userId: number;
}

let socket: any = null;

export default function EventComments({ eventId, userId }: EventCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const session = useSession();
  const username = session?.user?.username;

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/gateway/event-comment/${eventId}`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data: Comment[] = await response.json();
      
      // Organize comments and replies
      const commentMap = new Map<number, Comment>();
      data.forEach(comment => {
        if (!commentMap.has(comment.id)) {
          commentMap.set(comment.id, { ...comment, replies: [] });
        }
      });

      // Organize replies under their parent comments
      commentMap.forEach(comment => {
        if (comment.parentId && commentMap.has(comment.parentId)) {
          const parent = commentMap.get(comment.parentId)!;
          parent.replies!.push(comment);
          commentMap.delete(comment.id);
        }
      });

      setComments(Array.from(commentMap.values()));
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to fetch comments');
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_WS_URL);
    }

    const handleNewComment = (comment: Comment) => {
      setComments(prevComments => {
        const newComments = [...prevComments];
        const existingCommentIndex = newComments.findIndex(c => c.id === comment.id);
        
        if (existingCommentIndex !== -1) {
          // Comment already exists, don't add it again
          return prevComments;
        }

        if (comment.parentId) {
          // Find parent comment and append the reply
          const parentIndex = newComments.findIndex(c => c.id === comment.parentId);
          if (parentIndex !== -1) {
            const parentComment = { ...newComments[parentIndex] };
            parentComment.replies = [...(parentComment.replies || []), comment];
            newComments[parentIndex] = parentComment;
          }
        } else {
          // Add new top-level comment
          newComments.push({ ...comment, replies: [] });
        }
        return newComments;
      });
    };

    socket.off('onComment').on('onComment', handleNewComment);

    fetchComments();

    return () => {
      if (socket) {
        socket.off('onComment', handleNewComment);
      }
    };
  }, [eventId, fetchComments]);

  const handleSubmitComment = async () => {
    if (!userId || !newComment.trim() || !username) return;

    try {
      const commentData = {
        eventId,
        userId,
        commentText: newComment,
        username,
        parentId: replyTo,
      };

      socket.emit('Comment', commentData);

      setNewComment('');
      setReplyTo(null);
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment');
    }
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div
      key={comment.id}
      className={`mb-2 p-2 bg-amber-50 rounded-lg ${isReply ? 'ml-4 border-l-2 border-amber-200 ' : ''}`}
    >
      <p className="text-sm font-semibold text-amber-800">{comment.username}</p>
      <p className="text-xs text-gray-700">{comment.commentText}</p>
      <div className="flex justify-between items-center mt-1">

        {!isReply && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setReplyTo(comment.id)}
            className="text-xs p-1 h-6"
          >
            <Reply className="h-3 w-3 mr-1" />
            Reply
          </Button>
        )}
      </div>
      {comment.replies && comment.replies.map((reply) => renderComment(reply, true))}
    </div>
  );

  return (
    <div className="mt-4">
      <ScrollArea className="h-[300px] w-full rounded-md border p-2 mb-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <MessageSquare className="h-6 w-6 animate-pulse text-amber-500" />
          </div>
        ) : comments.length > 0 ? (
          comments.map(comment => renderComment(comment))
        ) : (
          <div className="text-center text-gray-500 text-xs">No comments yet. Be the first to comment!</div>
        )}
      </ScrollArea>
      <div className="flex flex-col space-y-2">
        {replyTo && (
          <div className="text-xs text-amber-600 flex justify-between items-center">
            <span>Replying to comment</span>
            <Button variant="ghost" size="sm" onClick={() => setReplyTo(null)} className="h-6 p-1">
              Cancel
            </Button>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder={replyTo ? "Write a reply..." : "Add a comment..."}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-grow text-xs"
          />
          <Button onClick={handleSubmitComment} disabled={!newComment.trim()} size="sm">
            <Send className="h-4 w-4 mr-2" />
            {replyTo ? 'Reply' : 'Post'}
          </Button>
        </div>
      </div>
    </div>
  );
}