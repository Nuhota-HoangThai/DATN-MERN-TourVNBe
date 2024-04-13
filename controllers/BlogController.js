const Blog = require("../models/Blog");

// Tạo một bài viết mới
exports.createBlog = async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.status(201).json({
      status: "success",
      data: newBlog,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Lấy danh sách tất cả bài viết với hỗ trợ phân trang
exports.getAllBlogsLimitAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Lấy số trang từ query, mặc định là 1 nếu không được cung cấp
    const limit = parseInt(req.query.limit) || 5; // Giới hạn số lượng bài viết mỗi trang, mặc định là 10
    const skip = (page - 1) * limit;

    // Tính tổng số bài viết để có thể tính tổng số trang
    const totalBlogs = await Blog.countDocuments();
    const totalPages = Math.ceil(totalBlogs / limit);

    const blogs = await Blog.find().skip(skip).limit(limit);

    res.status(200).json({
      status: "success",
      currentPage: page,
      limit,
      totalPages,
      totalBlogs,
      data: blogs,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Error fetching the blogs",
      error: err.message,
    });
  }
};

// ham nay chay phia khach hang
exports.getAllBlogsLimit = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Lấy số trang từ query, mặc định là 1 nếu không được cung cấp
    const limit = parseInt(req.query.limit) || 1; // Giới hạn số lượng bài viết mỗi trang, mặc định là 10
    const skip = (page - 1) * limit;

    // Tính tổng số bài viết để có thể tính tổng số trang
    const totalBlogs = await Blog.countDocuments();
    const totalPages = Math.ceil(totalBlogs / limit);

    const blogs = await Blog.find().skip(skip).limit(limit);

    res.status(200).json({
      status: "success",
      currentPage: page,
      limit,
      totalPages,
      totalBlogs,
      data: blogs,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Error fetching the blogs",
      error: err.message,
    });
  }
};

// Lấy chi tiết một bài viết theo ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        status: "fail",
        message: "Blog not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: blog,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "Blog not found",
    });
  }
};

// Cập nhật một bài viết
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        status: "fail",
        message: "Blog not found",
      });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: updatedBlog,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Xóa một bài viết
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({
        status: "fail",
        message: "Blog not found",
      });
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "Blog not found",
    });
  }
};
