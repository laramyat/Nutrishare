import React, { useEffect, useState } from 'react';

import {
  Home,
  Compass,
  Bookmark,
  PlusCircle,
  User,
  Shield,
  Search,
  Bell,
  Heart,
  MessageCircle,
  Star,
  Clock,
  Leaf,
  LogOut,
  Utensils,
  LayoutDashboard,
  Users,
  AlertTriangle,
  Trash2,
  Edit3,
  X,
  ImagePlus,
  Menu
} from 'lucide-react';

import api, { imageUrl } from './api';

// ==========================================
// CONSTANTS
// ==========================================

const blank = {
  title: '',
  category_id: '',
  description: '',
  ingredients: '',
  instructions: '',
  prep_minutes: 10,
  cook_minutes: 10,
  servings: 1,
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0
};

const cx = (...v) => v.filter(Boolean).join(' ');

// ==========================================
// AUTH COMPONENT
// IMPORTANT: OUTSIDE APP
// ==========================================

function AuthModal({
  auth,
  setAuth,
  authForm,
  setAuthForm,
  submitAuth,
  error,
  setError,
  close
}) {
  const isRegister = auth === 'register';
  const isForgot = auth === 'forgot';
  const isReset = auth === 'reset';

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <form onSubmit={submitAuth} className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xl font-black">
              <Leaf className="text-leaf-600" /> NutriShare
            </div>
            <p className="mt-1 text-sm text-stone-400">
              {isForgot ? 'Forgot password' : isReset ? 'Create a new password' : isRegister ? 'Create your community account' : 'Welcome back'}
            </p>
          </div>
          <button type="button" onClick={close}><X /></button>
        </div>

        {isRegister && (
          <input required type="text" placeholder="Full name"
            className="mb-3 w-full rounded-xl border p-3 text-sm outline-none focus:border-green-600"
            value={authForm.name}
            onChange={e => setAuthForm(prev => ({ ...prev, name: e.target.value }))} />
        )}

        <input required type="email" placeholder="Email address"
          className="mb-3 w-full rounded-xl border p-3 text-sm outline-none focus:border-green-600"
          value={authForm.email}
          onChange={e => setAuthForm(prev => ({ ...prev, email: e.target.value }))} />

        {isReset && (
          <input required type="text" placeholder="Reset token"
            className="mb-3 w-full rounded-xl border p-3 text-sm outline-none focus:border-green-600"
            value={authForm.token || ''}
            onChange={e => setAuthForm(prev => ({ ...prev, token: e.target.value }))} />
        )}

        {!isForgot && (
          <input required type="password" minLength={8}
            placeholder={isReset ? 'New password' : 'Password'}
            className="mb-3 w-full rounded-xl border p-3 text-sm outline-none focus:border-green-600"
            value={authForm.password}
            onChange={e => setAuthForm(prev => ({ ...prev, password: e.target.value }))} />
        )}

        {(isRegister || isReset) && (
          <input required type="password" minLength={8} placeholder="Confirm password"
            className="mb-3 w-full rounded-xl border p-3 text-sm outline-none focus:border-green-600"
            value={authForm.password_confirmation}
            onChange={e => setAuthForm(prev => ({ ...prev, password_confirmation: e.target.value }))} />
        )}

        {error && <p className="mb-3 text-sm text-rose-600">{error}</p>}

        <button type="submit" className="w-full rounded-xl bg-leaf-600 py-3 text-sm font-bold text-white hover:bg-leaf-700">
          {isForgot ? 'Send reset link' : isReset ? 'Reset password' : isRegister ? 'Create account' : 'Sign in'}
        </button>

        {auth === 'login' && (
          <p className="mt-3 text-right text-sm">
            <button type="button" className="font-semibold text-leaf-700"
              onClick={() => { setAuth('forgot'); setError(''); }}>
              Forgot password?
            </button>
          </p>
        )}

        <p className="mt-4 text-center text-sm text-stone-500">
          {isForgot || isReset ? 'Remember your password?' : isRegister ? 'Already have an account?' : 'New to NutriShare?'}{' '}
          <button type="button" className="font-bold text-leaf-700"
            onClick={() => { setAuth(isForgot || isReset || isRegister ? 'login' : 'register'); setError(''); }}>
            {isForgot || isReset || isRegister ? 'Sign in' : 'Register'}
          </button>
        </p>
      </form>
    </div>
  );
}

// ==========================================
// POST CREATE / EDIT MODAL
// IMPORTANT: OUTSIDE APP
// ==========================================

function PostModal({
  modal,
  active,
  form,
  setForm,
  categories,
  file,
  setFile,
  savePost,
  close
}) {
  if (modal !== 'post') return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-3">
      <form
        onSubmit={savePost}
        className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6"
      >
        <div className="mb-5 flex justify-between">
          <div>
            <h2 className="text-xl font-extrabold">
              {active ? 'Edit recipe' : 'Share a healthy recipe'}
            </h2>

            <p className="text-xs text-stone-400">
              Share your food inspiration with the community.
            </p>
          </div>

          <button type="button" onClick={close}>
            <X />
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">

          <label className="sm:col-span-2 text-xs font-bold">
            Recipe title

            <input
              required
              className="mt-1 w-full rounded-xl border p-3 text-sm"
              value={form.title}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  title: e.target.value
                }))
              }
            />
          </label>

          <label className="text-xs font-bold">
            Category

            <select
              required
              className="mt-1 w-full rounded-xl border p-3 text-sm"
              value={form.category_id}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  category_id: e.target.value
                }))
              }
            >
              <option value="">Choose category</option>

              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="text-xs font-bold">
            Food image

            <input
              type="file"
              accept="image/*"
              className="mt-1 w-full rounded-xl border p-2 text-xs"
              onChange={e => setFile(e.target.files?.[0] || null)}
            />
          </label>

          <label className="sm:col-span-2 text-xs font-bold">
            Description

            <textarea
              required
              rows="2"
              className="mt-1 w-full rounded-xl border p-3 text-sm"
              value={form.description || ''}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  description: e.target.value
                }))
              }
            />
          </label>

          <label className="sm:col-span-2 text-xs font-bold">
            Ingredients

            <textarea
              rows="2"
              className="mt-1 w-full rounded-xl border p-3 text-sm"
              value={form.ingredients || ''}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  ingredients: e.target.value
                }))
              }
            />
          </label>

          <label className="sm:col-span-2 text-xs font-bold">
            Cooking instructions

            <textarea
              rows="3"
              className="mt-1 w-full rounded-xl border p-3 text-sm"
              value={form.instructions || ''}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  instructions: e.target.value
                }))
              }
            />
          </label>

          {[
            ['prep_minutes', 'Prep min'],
            ['cook_minutes', 'Cook min'],
            ['servings', 'Servings'],
            ['calories', 'Calories'],
            ['protein', 'Protein g'],
            ['carbs', 'Carbs g'],
            ['fat', 'Fat g']
          ].map(([k, label]) => (
            <label key={k} className="text-xs font-bold">
              {label}

              <input
                type="number"
                min="0"
                className="mt-1 w-full rounded-xl border p-3 text-sm"
                value={form[k] ?? 0}
                onChange={e =>
                  setForm(prev => ({
                    ...prev,
                    [k]: e.target.value
                  }))
                }
              />
            </label>
          ))}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={close}
            className="rounded-xl border px-4 py-2 text-sm"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-xl bg-leaf-600 px-5 py-2 text-sm font-bold text-white"
          >
            {active ? 'Update recipe' : 'Publish'}
          </button>
        </div>
      </form>
    </div>
  );
}

// ==========================================
// RECIPE DETAIL MODAL
// IMPORTANT: OUTSIDE APP
// ==========================================

function DetailModal({
  modal,
  active,
  user,
  toggleLike,
  toggleBookmark,
  flash,
  setActive,
  close
}) {
  if (modal !== 'detail' || !active) return null;

  const reportPost = async () => {
    const reason = prompt('Why are you reporting this post?');

    if (!reason?.trim()) return;

    try {
      await api.post(`/posts/${active.id}/reports`, {
        reason
      });

      flash('Report submitted to admin');
    } catch {
      flash('Could not submit report');
    }
  };

  const addComment = async () => {
    const body = prompt('Write a comment');

    if (!body?.trim()) return;

    try {
      await api.post(`/posts/${active.id}/comments`, {
        body
      });

      const r = await api.get(`/posts/${active.id}`);

      setActive(r.data);
      flash('Comment added');
    } catch {
      flash('Could not add comment');
    }
  };

  const ratePost = async () => {
    const rating = prompt('Rate 1 to 5');

    if (!rating) return;

    const number = Number(rating);

    if (!Number.isInteger(number) || number < 1 || number > 5) {
      flash('Please enter a rating from 1 to 5');
      return;
    }

    try {
      await api.post(`/posts/${active.id}/ratings`, {
        rating: number
      });

      flash('Thank you for rating');
    } catch {
      flash('Could not submit rating');
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-3">
      <div className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white">

        <div className="relative">
          <img
            src={imageUrl(active.image)}
            onError={e => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1512621776951-a57141f2eeed?w=900';
            }}
            alt={active.title}
            className="h-64 w-full object-cover"
          />

          <button
            onClick={close}
            className="absolute right-3 top-3 rounded-full bg-white p-2"
          >
            <X />
          </button>
        </div>

        <div className="p-6">

          <span className="rounded-full bg-leaf-50 px-3 py-1 text-xs font-bold text-leaf-700">
            {active.category?.name}
          </span>

          <h2 className="mt-3 text-2xl font-extrabold">
            {active.title}
          </h2>

          <p className="mt-2 text-sm leading-6 text-stone-500">
            {active.description}
          </p>

          <div className="my-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              ['Calories', `${active.calories ?? 0} kcal`],
              ['Protein', `${active.protein ?? 0}g`],
              ['Carbs', `${active.carbs ?? 0}g`],
              ['Fat', `${active.fat ?? 0}g`]
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl bg-leaf-50 p-3 text-center"
              >
                <p className="text-xs text-stone-500">
                  {label}
                </p>

                <b className="text-leaf-700">
                  {value}
                </b>
              </div>
            ))}
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <div>
              <h3 className="font-bold">Ingredients</h3>

              <p className="mt-2 whitespace-pre-line text-sm text-stone-600">
                {active.ingredients || 'No ingredients provided.'}
              </p>

              <p className="mt-4 text-xs text-stone-500">
                Prep {active.prep_minutes} min ·
                Cook {active.cook_minutes} min ·
                Serves {active.servings}
              </p>
            </div>

            <div>
              <h3 className="font-bold">
                Cooking instructions
              </h3>

              <p className="mt-2 whitespace-pre-line text-sm text-stone-600">
                {active.instructions || 'No instructions provided.'}
              </p>
            </div>

          </div>

          <div className="mt-5 flex flex-wrap gap-2 border-t pt-4">

            <button
              onClick={() => toggleLike(active)}
              className="rounded-xl border px-4 py-2 text-sm"
            >
              <Heart size={16} className="mr-1 inline" />
              Like
            </button>

            <button
              onClick={() => toggleBookmark(active)}
              className="rounded-xl border px-4 py-2 text-sm"
            >
              <Bookmark size={16} className="mr-1 inline" />
              Save
            </button>

            {user && (
              <>
                <button
                  onClick={reportPost}
                  className="rounded-xl border px-4 py-2 text-sm text-rose-600"
                >
                  Report
                </button>

                <button
                  onClick={addComment}
                  className="rounded-xl border px-4 py-2 text-sm"
                >
                  <MessageCircle size={16} className="mr-1 inline" />
                  Comment
                </button>

                <button
                  onClick={ratePost}
                  className="rounded-xl border px-4 py-2 text-sm"
                >
                  <Star size={16} className="mr-1 inline" />
                  Rate
                </button>
              </>
            )}
          </div>

          <h3 className="mt-5 font-bold">Comments</h3>

          {(active.comments || []).map(c => (
            <p
              key={c.id}
              className="mt-2 rounded-xl bg-stone-50 p-3 text-sm"
            >
              <b>{c.user?.name || 'User'}:</b> {c.body}
            </p>
          ))}

          {(!active.comments || active.comments.length === 0) && (
            <p className="mt-2 text-sm text-stone-400">
              No comments yet. Be the first to comment!
            </p>
          )}

        </div>
      </div>
    </div>
  );
}

// ==========================================
// RECIPE CARD
// IMPORTANT: OUTSIDE APP
// ==========================================

function RecipeCard({
  p,
  user,
  isAdmin,
  openDetails,
  toggleLike,
  toggleBookmark,
  openCreate,
  removePost
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm">

      <button
        onClick={() => openDetails(p)}
        className="block h-48 w-full"
      >
        <img
          src={imageUrl(p.image)}
          alt={p.title}
          onError={e => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1512621776951-a57141f2eeed?w=900';
          }}
          className="h-full w-full object-cover"
        />
      </button>

      <div className="p-4">

        <div className="flex justify-between text-xs text-stone-400">
          <span>{p.category?.name}</span>

          <span>
            <Star
              size={13}
              className="inline text-amber-400"
            />
            {' '}
            {p.average_rating || 'New'}
          </span>
        </div>

        <button
          onClick={() => openDetails(p)}
          className="mt-2 text-left text-lg font-extrabold hover:text-leaf-700"
        >
          {p.title}
        </button>

        <p className="mt-2 line-clamp-2 text-sm text-stone-500">
          {p.description}
        </p>

        <div className="mt-4 flex items-center justify-between border-t pt-3">

          <span className="text-xs font-semibold text-stone-500">
            {p.user?.name || 'Community member'}
          </span>

          <div className="flex gap-3 text-stone-400">

            <button
              onClick={() => toggleLike(p)}
              title="Like"
            >
              <Heart size={17} />
            </button>

            <button
              onClick={() => openDetails(p)}
              title="Comments"
            >
              <MessageCircle size={17} />
            </button>

            <button
              onClick={() => toggleBookmark(p)}
              title="Save"
            >
              <Bookmark size={17} />
            </button>

            {(p.user_id === user?.id || isAdmin) && (
              <button
                onClick={() => openCreate(p)}
                title="Edit"
              >
                <Edit3 size={16} />
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => removePost(p)}
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            )}

          </div>
        </div>
      </div>
    </article>
  );
}

// ==========================================
// SIDEBAR
// IMPORTANT: OUTSIDE APP
// ==========================================

function Sidebar({ isAdmin, nav, page, setPage }) {
  return (
    <aside className="hidden w-60 shrink-0 border-r bg-white p-5 lg:block">

      <div className="mb-8 flex items-center gap-2">

        <span className="grid h-10 w-10 place-items-center rounded-xl bg-leaf-600 text-white">
          <Leaf />
        </span>

        <div>
          <b className="text-lg">NutriShare</b>

          <p className="text-[10px] uppercase tracking-widest text-stone-400">
            Eat well, live well
          </p>
        </div>
      </div>

      <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-stone-400">
        {isAdmin ? 'Administration' : 'Community'}
      </p>

      {nav.map(([id, label, Icon]) => (
        <button
          key={id}
          onClick={() => setPage(id)}
          className={cx(
            'mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold',
            page === id
              ? 'bg-leaf-50 text-leaf-700'
              : 'text-stone-500 hover:bg-stone-50'
          )}
        >
          <Icon size={18} />
          {label}
        </button>
      ))}

      <div className="mt-8 rounded-2xl bg-leaf-50 p-4">
        <b className="text-sm text-leaf-700">
          Small steps matter
        </b>

        <p className="mt-2 text-xs leading-5 text-stone-500">
          Share nourishing meals and inspire someone today.
        </p>
      </div>
    </aside>
  );
}

// ==========================================
// ADMIN PANEL
// IMPORTANT: OUTSIDE APP
// ==========================================

function AdminPanel({
  page,
  stats,
  users,
  reports,
  categories,
  posts,
  adminLoad,
  flash,
  setCategories,
  RecipeCardComponent
}) {
  const [userSearch, setUserSearch] = useState('');

  if (page === 'dashboard') {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {[
          ['Members', stats?.users, Users],
          ['Food posts', stats?.posts, Utensils],
          ['Categories', stats?.categories, Leaf],
          ['Pending reports', stats?.reports, AlertTriangle]
        ].map(([label, number, Icon]) => (
          <div
            key={label}
            className="rounded-2xl bg-white p-6 shadow-sm"
          >
            <Icon className="text-leaf-600" />

            <p className="mt-4 text-sm text-stone-500">
              {label}
            </p>

            <b className="text-3xl">
              {number ?? '—'}
            </b>
          </div>
        ))}
      </div>
    );
  }

  if (page === 'users') {
    const filteredUsers = users.filter(u =>
      `${u.name || ''} ${u.email || ''} ${u.role || ''}`.toLowerCase().includes(userSearch.toLowerCase())
    );

    const toggleBan = async u => {
      const currentlyBanned = Boolean(u.is_banned);
      if (!window.confirm(`${currentlyBanned ? 'Unban' : 'Ban'} ${u.name}?`)) return;
      try {
        await api.patch(`/admin/users/${u.id}/ban`, { is_banned: !currentlyBanned });
        flash(currentlyBanned ? 'User unbanned' : 'User banned');
        adminLoad();
      } catch (e) {
        flash(e.response?.data?.message || 'Could not update user status. Check backend API route.');
      }
    };

    const deleteUser = async u => {
      if (!window.confirm(`Delete user ${u.name}? This cannot be undone.`)) return;
      try {
        await api.delete(`/admin/users/${u.id}`);
        flash('User deleted');
        adminLoad();
      } catch (e) {
        flash(e.response?.data?.message || 'Could not delete user. Check backend API route.');
      }
    };

    const changeRole = async (u, role) => {
      try {
        await api.patch(`/admin/users/${u.id}`, { role });
        flash('User role updated');
        adminLoad();
      } catch (e) {
        flash(e.response?.data?.message || 'Could not update user role. Check backend API route.');
      }
    };

    return (
      <div className="rounded-2xl bg-white p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-bold">User management</h2>
            <p className="text-xs text-stone-400">{users.length} registered users</p>
          </div>
          <input value={userSearch} onChange={e => setUserSearch(e.target.value)}
            placeholder="Search name, email or role..."
            className="w-full max-w-sm rounded-xl border px-3 py-2 text-sm outline-none focus:border-green-600" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-stone-50 text-stone-500">
              <tr>
                <th className="p-3">Member</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3">Joined</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id} className="border-b">
                  <td className="p-3">
                    <div className="font-semibold">{u.name}</div>
                    <div className="text-xs text-stone-400">{u.email}</div>
                  </td>
                  <td className="p-3">
                    <select value={u.role || 'member'} onChange={e => changeRole(u, e.target.value)}
                      disabled={u.role === 'admin'}
                      className="rounded-lg border p-2 text-xs">
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <span className={cx('rounded-full px-2 py-1 text-xs font-bold', u.is_banned ? 'bg-rose-100 text-rose-700' : 'bg-green-100 text-green-700')}>
                      {u.is_banned ? 'Banned' : 'Active'}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-stone-500">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      {u.role !== 'admin' && (
                        <button onClick={() => toggleBan(u)}
                          className="rounded-lg border px-3 py-2 text-xs font-semibold text-amber-700">
                          {u.is_banned ? 'Unban' : 'Ban'}
                        </button>
                      )}
                      {u.role !== 'admin' && (
                        <button onClick={() => deleteUser(u)}
                          className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700">
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && <p className="py-8 text-center text-sm text-stone-400">No users found.</p>}
      </div>
    );
  }

  if (page === 'reports') {
    return (
      <div className="rounded-2xl bg-white p-5">
        <h2 className="mb-4 font-bold">Reported posts</h2>

        {reports.map(r => (
          <div
            key={r.id}
            className="flex flex-wrap items-center justify-between gap-3 border-b py-3 text-sm"
          >
            <span>
              {r.post?.title || 'Unknown post'} — {r.reason}
            </span>

            <button
              onClick={async () => {
                try {
                  await api.patch(
                    `/admin/reports/${r.id}/resolve`
                  );

                  flash('Report resolved');
                  adminLoad();
                } catch {
                  flash('Could not resolve report');
                }
              }}
              className="font-bold text-leaf-700"
            >
              Resolve
            </button>
          </div>
        ))}

        {reports.length === 0 && (
          <p className="text-sm text-stone-400">
            No reports found.
          </p>
        )}
      </div>
    );
  }

  if (page === 'categories') {
    return (
      <div className="rounded-2xl bg-white p-5">

        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold">Food categories</h2>

          <button
            onClick={async () => {
              const name = prompt('New category name');

              if (!name?.trim()) return;

              try {
                await api.post('/admin/categories', {
                  name: name.trim()
                });

                const r = await api.get('/categories');

                setCategories(r.data);

                flash('Category created');
              } catch (e) {
                flash(
                  e.response?.data?.message ||
                  'Could not create category'
                );
              }
            }}
            className="rounded-lg bg-leaf-600 px-3 py-2 text-xs font-bold text-white"
          >
            + Add category
          </button>
        </div>

        {categories.map(c => (
          <p key={c.id} className="border-b py-3 text-sm">
            {c.name}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {posts.map(p => (
        <RecipeCardComponent key={p.id} p={p} />
      ))}
    </div>
  );
}

// ==========================================
// MAIN APP
// ==========================================

export default function App() {

  // USER
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('nutri_user'));
    } catch {
      return null;
    }
  });

  // PAGE AND DATA
  const [page, setPage] = useState('home');

  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [saved, setSaved] = useState([]);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);

  // MODALS
  const [modal, setModal] = useState('');
  const [active, setActive] = useState(null);

  // RECIPE FORM
  const [form, setForm] = useState(blank);
  const [file, setFile] = useState(null);

  // AUTH FORM
  const [auth, setAuth] = useState('login');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const email = params.get('email');
    if (token) {
      setAuth('reset');
      setModal('auth');
      setAuthForm(prev => ({ ...prev, token, email: email || prev.email }));
    }
  }, []);

  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    token: ''
  });

  const [error, setError] = useState('');

  // NOTIFICATION
  const [notice, setNotice] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const isAdmin = user?.role === 'admin';

  // ========================================
  // NOTIFICATION
  // ========================================

  const flash = message => {
    setNotice(message);

    setTimeout(() => {
      setNotice('');
    }, 2600);
  };

  // ========================================
  // LOAD POSTS AND CATEGORIES
  // ========================================

  const load = async () => {
    try {
      const [p, c] = await Promise.all([
        api.get('/posts'),
        api.get('/categories')
      ]);

      setPosts(p.data.data || p.data);
      setCategories(c.data.data || c.data);
    } catch (e) {
      console.error('Loading error:', e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ========================================
  // CHECK CURRENT USER
  // ========================================

  useEffect(() => {
    if (!user) return;

    api.get('/me')
      .then(r => {
        setUser(r.data);

        localStorage.setItem(
          'nutri_user',
          JSON.stringify(r.data)
        );
      })
      .catch(() => {
        logout();
      });

  }, []);

  useEffect(() => {
    if (user) {
      load();
    }
  }, [user]);

  // ========================================
  // LOGOUT
  // ========================================

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (e) {
      console.error(e);
    }

    localStorage.removeItem('nutri_token');
    localStorage.removeItem('nutri_user');

    setUser(null);
    setPage('home');
    setSaved([]);
    setModal('');
    setSearch('');
    setCategory('');

    flash('Logged out successfully');
  };

  // ========================================
  // LOGIN AND REGISTER
  // ========================================

  const submitAuth = async e => {
    e.preventDefault();
    setError('');

    try {
      if (auth === 'forgot') {
        const r = await api.post('/forgot-password', { email: authForm.email });
        setError(r.data.message || r.data.status || 'If the email is registered, a password reset link will be sent.');
        return;
      }

      if (auth === 'reset') {
        await api.post('/reset-password', {
          email: authForm.email,
          token: authForm.token,
          password: authForm.password,
          password_confirmation: authForm.password_confirmation
        });
        setAuth('login');
        setAuthForm({ name: '', email: authForm.email, password: '', password_confirmation: '', token: '' });
        setError('Password reset successfully. Please sign in.');
        return;
      }

      const endpoint = auth === 'login' ? '/login' : '/register';
      const r = await api.post(endpoint, authForm);

      localStorage.setItem('nutri_token', r.data.token);
      localStorage.setItem('nutri_user', JSON.stringify(r.data.user));
      setUser(r.data.user);
      setPage(r.data.user.role === 'admin' ? 'dashboard' : 'home');
      setModal('');
      setAuthForm({ name: '', email: '', password: '', password_confirmation: '', token: '' });
      flash(auth === 'login' ? 'Welcome back!' : 'Account created successfully!');
    } catch (e) {
      setError(
        e.response?.data?.message ||
        e.response?.data?.status ||
        Object.values(e.response?.data?.errors || {}).flat().join(' ') ||
        'Request failed. Please check your details and backend API.'
      );
    }
  };

  // ========================================
  // LOAD SAVED RECIPES
  // ========================================

  const loadSaved = async () => {
    try {
      const r = await api.get('/bookmarks');

      setSaved(r.data.data || r.data);
    } catch (e) {
      console.error('Saved recipes error:', e);
    }
  };

  useEffect(() => {
    if (user) {
      loadSaved();
    } else {
      setSaved([]);
    }
  }, [user]);

  // ========================================
  // BOOKMARK
  // ========================================

  const toggleBookmark = async p => {
    if (!user) {
      setAuth('login');
      setModal('auth');
      return;
    }

    try {
      const r = await api.post(
        `/posts/${p.id}/bookmark`
      );

      await loadSaved();

      flash(
        r.data.saved
          ? 'Recipe saved'
          : 'Removed from saved recipes'
      );
    } catch {
      flash('Could not update bookmark');
    }
  };

  // ========================================
  // LIKE
  // ========================================

  const toggleLike = async (p) => {
  if (!user) {
    setAuth('login');
    setModal('auth');
    return;
  }

  try {
    const response = await api.post(`/posts/${p.id}/like`);

    await load();

    flash(response.data.liked ? 'Liked successfully' : 'Like removed');
  } catch (error) {
    console.error('Like Error:', error.response?.data || error);

    flash(
      error.response?.data?.message ||
      'Could not like this post'
    );
  }
};
  // ========================================
  // OPEN CREATE OR EDIT RECIPE
  // ========================================

  const openCreate = p => {
    if (!user) {
      setAuth('login');
      setModal('auth');
      return;
    }

    setActive(p || null);

    setForm(
      p
        ? {
            ...blank,
            ...p,
            category_id:
              p.category_id ||
              p.category?.id ||
              ''
          }
        : {
            ...blank,
            category_id: categories[0]?.id || ''
          }
    );

    setFile(null);

    setModal('post');
  };

  // ========================================
  // SAVE RECIPE
  // ========================================

  const savePost = async (e) => {
    e.preventDefault();

    const isEditing = !!active;
    const fd = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      // Do not send an old image path as an image file
      if (
        key !== 'image' &&
        value !== null &&
        value !== undefined
      ) {
        fd.append(key, value);
      }
    });

    // Only send image when a new file is selected
    if (file instanceof File) {
      fd.append('image', file);
    }

    try {
      if (isEditing) {
        fd.append('_method', 'PUT');

        await api.post(`/posts/${active.id}`, fd, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await api.post('/posts', fd, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      setModal('');
      setActive(null);
      setFile(null);

      await load();

      flash(
        isEditing
          ? 'Post updated'
          : 'Recipe published'
      );

    } catch (error) {
      console.error(
        'Save Post Error:',
        error.response?.data || error
      );

      flash(
        error.response?.data?.message ||
        Object.values(
          error.response?.data?.errors || {}
        ).flat().join(' ') ||
        'Could not save post'
      );
    }
  };
  // ========================================
  // DELETE RECIPE
  // ========================================

  const removePost = async p => {
    if (!window.confirm('Delete this food post?')) {
      return;
    }

    try {
      await api.delete(`/posts/${p.id}`);

      await load();

      flash('Post deleted');
    } catch {
      flash('Unable to delete post');
    }
  };

  // ========================================
  // RECIPE DETAILS
  // ========================================

  const openDetails = async p => {
    try {
      const r = await api.get(`/posts/${p.id}`);

      setActive(r.data);
    } catch {
      setActive(p);
    }

    setModal('detail');
  };

  // ========================================
  // SEARCH AND CATEGORY FILTER
  // ========================================

  const doSearch = async () => {
    try {
      const r = await api.get('/posts', {
        params: {
          search: search || undefined,
          category: category || undefined
        }
      });

      setPosts(r.data.data || r.data);
    } catch (e) {
      console.error('Search error:', e);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      doSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, category]);

  // ========================================
  // MEMBER NOTIFICATIONS
  // Backend should expose GET /notifications and PATCH /notifications/{id}/read
  // ========================================

  const loadNotifications = async () => {
    if (!user) return;
    try {
      const r = await api.get('/notifications');
      setNotifications(r.data.data || r.data.notifications || r.data || []);
    } catch (e) {
      // Keep the app usable if notification API has not been added yet.
      console.info('Notifications API is not available yet.');
    }
  };

  const markNotificationRead = async notification => {
    try {
      await api.patch(`/notifications/${notification.id}/read`);
      setNotifications(prev => prev.map(n =>
        n.id === notification.id ? { ...n, read_at: n.read_at || new Date().toISOString(), read: true } : n
      ));
    } catch (e) {
      flash('Could not mark notification as read');
    }
  };

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }
    loadNotifications();
  }, [user]);

  // ========================================
  // ADMIN DATA
  // ========================================

  const adminLoad = async () => {
    try {
      const [s, u, r] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/reports')
      ]);

      setStats(s.data);

      setUsers(u.data.data || u.data);

      setReports(r.data.data || r.data);

    } catch (e) {
      console.error('Admin error:', e);

      flash('Admin data could not be loaded');
    }
  };

  useEffect(() => {
    if (
      isAdmin &&
      [
        'dashboard',
        'users',
        'reports',
        'categories',
        'manage-posts'
      ].includes(page)
    ) {
      adminLoad();
    }
  }, [page, user]);

  // ========================================
  // NAVIGATION
  // ========================================

  const nav = isAdmin
    ? [
        ['dashboard', 'Dashboard', LayoutDashboard],
        ['manage-posts', 'Food posts', Utensils],
        ['users', 'Users', Users],
        ['categories', 'Categories', Leaf],
        ['reports', 'Reports', AlertTriangle]
      ]
    : [
        ['home', 'Home', Home],
        ['explore', 'Explore', Compass],
        ['saved', 'Saved recipes', Bookmark],
        ['my-posts', 'My posts', User]
      ];

  // ========================================
  // FILTER DISPLAYED RECIPES
  // ========================================

  const shown =
    page === 'saved'
      ? saved
      : page === 'my-posts'
        ? posts.filter(
            p => p.user_id === user?.id
          )
        : posts;

  // ========================================
  // REUSABLE CARD FOR ADMIN
  // ========================================

  const AdminRecipeCard = ({ p }) => (
    <RecipeCard
      p={p}
      user={user}
      isAdmin={isAdmin}
      openDetails={openDetails}
      toggleLike={toggleLike}
      toggleBookmark={toggleBookmark}
      openCreate={openCreate}
      removePost={removePost}
    />
  );

  // ========================================
  // MAIN CONTENT
  // ========================================

  let mainContent;

  if (isAdmin) {
    mainContent = (
      <AdminPanel
        page={page}
        stats={stats}
        users={users}
        reports={reports}
        categories={categories}
        posts={posts}
        adminLoad={adminLoad}
        flash={flash}
        setCategories={setCategories}
        RecipeCardComponent={AdminRecipeCard}
      />
    );
  } else if (page === 'home') {
    mainContent = (
      <>
        <section className="relative mb-8 overflow-hidden rounded-3xl bg-[#eaf3e7]">

          <div className="relative z-10 max-w-xl p-8 md:p-10">

            <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold uppercase text-leaf-700">
              A community that nourishes
            </span>

            <h2 className="mt-4 text-4xl font-black leading-tight text-[#294a31]">
              Good food.
              <br />
              Good mood.
              <br />

              <span className="text-leaf-600">
                Better together.
              </span>
            </h2>

            <p className="mt-3 max-w-sm text-sm leading-6 text-stone-600">
              Discover wholesome recipes, share your
              kitchen creations and find inspiration
              from the community.
            </p>

            <button
              onClick={() => openCreate()}
              className="mt-5 rounded-xl bg-leaf-600 px-5 py-3 text-sm font-bold text-white"
            >
              Add your recipe +
            </button>

          </div>

          <img
            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1000"
            alt="Healthy food"
            className="absolute right-0 top-0 hidden h-full w-[48%] object-cover md:block"
          />

        </section>

        <h2 className="mb-4 text-xl font-extrabold">
          Explore by category
        </h2>

        <div className="mb-7 flex gap-2 overflow-x-auto pb-2">

          <button
            onClick={() => setCategory('')}
            className={cx(
              'shrink-0 rounded-full px-4 py-2 text-xs font-bold',
              !category
                ? 'bg-leaf-600 text-white'
                : 'bg-white text-stone-500'
            )}
          >
            All foods
          </button>

          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={cx(
                'shrink-0 rounded-full px-4 py-2 text-xs font-bold',
                String(category) === String(c.id)
                  ? 'bg-leaf-600 text-white'
                  : 'bg-white text-stone-500'
              )}
            >
              {c.name}
            </button>
          ))}

        </div>

        <h2 className="mb-4 text-xl font-extrabold">
          Fresh from the community
        </h2>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

          {posts.map(p => (
            <RecipeCard
              key={p.id}
              p={p}
              user={user}
              isAdmin={isAdmin}
              openDetails={openDetails}
              toggleLike={toggleLike}
              toggleBookmark={toggleBookmark}
              openCreate={openCreate}
              removePost={removePost}
            />
          ))}

        </div>
      </>
    );
  } else {
    mainContent = (
      <>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

          <div>
            <h2 className="text-xl font-extrabold">
              {page === 'saved'
                ? 'Saved recipes'
                : page === 'my-posts'
                  ? 'My food posts'
                  : 'Explore recipes'}
            </h2>

            <p className="text-sm text-stone-400">
              Browse nourishing ideas from the community.
            </p>
          </div>

          <button
            onClick={() => openCreate()}
            className="rounded-xl bg-leaf-600 px-4 py-3 text-sm font-bold text-white"
          >
            + Add recipe
          </button>

        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

          {shown.map(p => (
            <RecipeCard
              key={p.id}
              p={p}
              user={user}
              isAdmin={isAdmin}
              openDetails={openDetails}
              toggleLike={toggleLike}
              toggleBookmark={toggleBookmark}
              openCreate={openCreate}
              removePost={removePost}
            />
          ))}

        </div>

        {shown.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center">
            <Utensils
              size={35}
              className="mx-auto text-stone-300"
            />

            <h3 className="mt-3 font-bold">
              No recipes found
            </h3>

            <p className="mt-2 text-sm text-stone-400">
              Try another category or search keyword.
            </p>
          </div>
        )}
      </>
    );
  }

  // ========================================
  // APP RETURN
  // ========================================

  return (
    <div className="min-h-screen">

      <div className="flex min-h-screen">

        {/* SIDEBAR */}

        <Sidebar
          isAdmin={isAdmin}
          nav={nav}
          page={page}
          setPage={setPage}
        />

        {/* MAIN */}

        <main className="min-w-0 flex-1">

          {/* HEADER */}

          <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b bg-white/95 px-4 backdrop-blur md:px-8">

            <div>
              <p className="text-xs text-stone-400">
                Welcome back, {user?.name || 'food lover'} 👋
              </p>

              <h1 className="font-extrabold">
                {isAdmin
                  ? `Admin · ${page}`
                  : 'Healthy food community'}
              </h1>
            </div>

            <div className="flex items-center gap-3">

              <div className="hidden items-center gap-2 rounded-xl bg-stone-50 px-3 py-2 sm:flex">
                <Search size={16} />

                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search recipes..."
                  className="w-36 bg-transparent text-sm outline-none"
                />
              </div>

              {user ? (
                <>
                  <div className="relative">
                    <button onClick={() => { setShowNotifications(v => !v); loadNotifications(); }}
                      className="relative rounded-full p-2 hover:bg-stone-100" title="Notifications">
                      <Bell size={19} />
                      {notifications.some(n => !n.read_at && !n.read) && (
                        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500" />
                      )}
                    </button>
                    {showNotifications && (
                      <div className="absolute right-0 top-12 z-50 w-80 max-w-[90vw] rounded-2xl border bg-white p-3 shadow-xl">
                        <div className="mb-2 flex items-center justify-between">
                          <b className="text-sm">Notifications</b>
                          <button onClick={() => setShowNotifications(false)}><X size={16} /></button>
                        </div>
                        <div className="max-h-72 overflow-y-auto">
                          {notifications.length ? notifications.map(n => (
                            <button key={n.id} onClick={() => markNotificationRead(n)}
                              className={cx('block w-full rounded-xl p-3 text-left text-sm hover:bg-stone-50', (!n.read_at && !n.read) && 'bg-green-50')}>
                              <span className="block font-semibold">{n.title || n.data?.title || 'NutriShare update'}</span>
                              <span className="mt-1 block text-xs text-stone-500">{n.message || n.data?.message || n.data?.body || 'You have a new notification.'}</span>
                              <span className="mt-1 block text-[10px] text-stone-400">{n.created_at ? new Date(n.created_at).toLocaleString() : ''}</span>
                            </button>
                          )) : <p className="p-4 text-center text-xs text-stone-400">No notifications yet.</p>}
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-leaf-100 text-sm font-bold text-leaf-700">
                    {user.name?.slice(0, 1)}
                  </span>

                  <button
                    onClick={logout}
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setAuth('login');
                    setModal('auth');
                  }}
                  className="rounded-xl bg-leaf-600 px-4 py-2 text-sm font-bold text-white"
                >
                  Sign in
                </button>
              )}

            </div>
          </header>

          {/* PAGE CONTENT */}

          <div className="mx-auto max-w-[1400px] p-4 md:p-8">

            {!isAdmin && (
              <div className="mb-4 flex gap-2 overflow-x-auto lg:hidden">

                {nav.map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setPage(id)}
                    className={cx(
                      'shrink-0 rounded-full px-4 py-2 text-xs font-bold',
                      page === id
                        ? 'bg-leaf-600 text-white'
                        : 'bg-white'
                    )}
                  >
                    {label}
                  </button>
                ))}

              </div>
            )}

            {mainContent}

          </div>
        </main>
      </div>

      {/* FLOATING SHARE BUTTON */}

      {user && !isAdmin && (
        <button
          onClick={() => openCreate()}
          className="fixed bottom-6 right-6 flex items-center gap-2 rounded-full bg-leaf-600 px-5 py-4 text-sm font-bold text-white shadow-xl"
        >
          <PlusCircle />
          Add recipe
        </button>
      )}

      {/* AUTH MODAL */}

      {modal === 'auth' && (
        <AuthModal
          auth={auth}
          setAuth={setAuth}
          authForm={authForm}
          setAuthForm={setAuthForm}
          submitAuth={submitAuth}
          error={error}
          setError={setError}
          close={() => setModal('')}
        />
      )}

      {/* POST MODAL */}

      <PostModal
        modal={modal}
        active={active}
        form={form}
        setForm={setForm}
        categories={categories}
        file={file}
        setFile={setFile}
        savePost={savePost}
        close={() => setModal('')}
      />

      {/* DETAIL MODAL */}

      <DetailModal
        modal={modal}
        active={active}
        user={user}
        toggleLike={toggleLike}
        toggleBookmark={toggleBookmark}
        flash={flash}
        setActive={setActive}
        close={() => setModal('')}
      />

      {/* NOTIFICATION */}

      {notice && (
        <div className="fixed bottom-5 left-1/2 z-[80] -translate-x-1/2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white">
          {notice}
        </div>
      )}

    </div>
  );
}