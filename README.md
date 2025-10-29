# My Real Tech Stories

A modern, responsive tech blog built with React, TypeScript, and Vite. Features a complete admin panel for managing posts with localStorage-based persistence.

## 🚀 Features

- **Blog Posts**: Create, edit, and publish blog posts with markdown support
- **Admin Dashboard**: Manage all your posts from a centralized admin panel
- **Authentication**: Secure login system with local credential storage
- **Categories**: Organize posts with predefined categories (Technology, Programming, Career, AI & ML)
- **Responsive Design**: Mobile-friendly interface
- **Data Management**: Export, import, and backup your blog data
- **Storage Statistics**: Real-time view of your stored posts and categories
- **LocalStorage Based**: No backend required - all data persists in browser localStorage

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Tech-Blog
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

## 🔐 Default Credentials

**Username**: admin  
**Password**: admin  
**Email**: admin@techstories.com

You can use either the username or email to login.

## 📁 Project Structure

```
Tech-Blog/
├── src/
│   ├── components/        # Reusable components
│   │   ├── Layout.tsx     # Main layout with navigation
│   │   ├── DataManager.tsx   # Data export/import/backup
│   │   └── StorageStatus.tsx # Storage statistics display
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx    # Authentication state management
│   ├── lib/               # Utilities and adapters
│   │   ├── localStorage.ts    # Core localStorage database
│   │   ├── localStorageAdapter.ts  # Supabase-compatible API wrapper
│   │   └── supabase.ts    # Storage system export
│   ├── pages/             # Page components
│   │   ├── Home.tsx       # Homepage with post listings
│   │   ├── Login.tsx      # Login page
│   │   ├── Register.tsx   # Registration page
│   │   ├── AdminNew.tsx   # Admin dashboard
│   │   ├── PostDetail.tsx # Individual post view
│   │   └── PostEditor.tsx # Post creation/editing
│   ├── App.tsx           # Main app component with routing
│   ├── main.tsx          # App entry point
│   └── index.css         # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎨 Technology Stack

- **React 18.2.0** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite 5.0.8** - Fast build tool and dev server
- **React Router 6.20.0** - Client-side routing
- **LocalStorage API** - Browser-based data persistence

## 💾 Data Management

The blog uses browser localStorage to persist all data. This means:

- All posts, categories, and user data are stored locally in your browser
- Data persists between sessions
- No server or database setup required
- You can export/import data using the 💾 button

### Storage Keys

- `tech-blog-posts` - All blog posts
- `tech-blog-categories` - Post categories
- `tech-blog-user` - Current user session
- `tech-blog-auth` - Authentication state
- `tech-blog-credentials` - User credentials

### Export/Import Data

1. Click the 💾 button (bottom-right corner)
2. Choose from:
   - **Export Data** - Download all your data as JSON
   - **Import Data** - Restore from a previously exported file
   - **Clear All Data** - Reset to default state

## 📝 Creating Posts

1. Login with admin credentials
2. Navigate to the Admin panel
3. Click "New Post"
4. Fill in:
   - Title
   - Content (supports markdown)
   - Excerpt
   - Category
   - Status (Draft/Published)
5. Click "Save Post"

## 🔄 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Port Configuration

The app will automatically try ports in this order:
- 5173 (default)
- 5174 (if 5173 is occupied)
- 5175 (if 5174 is occupied)

## 🌐 Migrating to Real Backend (Optional)

Currently, the app uses localStorage for data persistence. To migrate to a real backend:

1. Set up a Supabase project (or your preferred backend)
2. Update `src/lib/supabase.ts` to use real Supabase client
3. Replace localStorage calls with actual database queries
4. See `setup-supabase.md` for detailed migration guide (if available)

## 🐛 Troubleshooting

### Posts not appearing
- Check browser console for errors
- Verify localStorage is enabled in your browser
- Try clearing cache and hard refresh (Cmd+Shift+R on Mac)

### Login not working
- Ensure you're using correct credentials (admin/admin)
- Check browser console for auth errors
- Clear localStorage and restart the app

### Dev server won't start
- Check if ports 5173-5175 are available
- Run `npm install` to ensure dependencies are installed
- Delete `node_modules/.vite` cache folder

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## 👨‍💻 Author

Built with ❤️ for sharing real tech stories.

---

**Note**: This is a development version using localStorage. For production use, consider migrating to a proper backend database.
