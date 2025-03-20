import { addBlog } from './Blog.controller.js';
import Blog from '../models/blog.model.js';

jest.mock('../models/blog.model.js');

describe('Blog Controller - Add Blog', () => {
  it('should return 201 if blog is successfully created', async () => {
    const mockBlog = { title: 'Test Blog', content: 'Test Content', author: 'Test Author' };
    Blog.create.mockResolvedValue(mockBlog);

    const req = { body: mockBlog };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await addBlog(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, blog: mockBlog }));
  });

  it('should call next with an error if blog creation fails', async () => {
    Blog.create.mockRejectedValue(new Error('Database error'));

    const req = { body: { title: 'Test Blog', content: 'Test Content' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await addBlog(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Database error' }));
  });

  it('should return 400 if required fields are missing', async () => {
    const req = { body: { title: 'Test Blog' } }; // Missing content and author
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await addBlog(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400); // Ensure 400 status is returned
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: 'Missing required fields' }));
  });
});
