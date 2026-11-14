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
  Menu,
  Camera,
  Filter,
  CheckCircle2,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Activity,
  Send,
  Settings,
  Check,
  XCircle
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

function AuthModal({ auth, setAuth, authForm, setAuthForm, submitAuth, error, setError, close }) {
  const isRegister = auth === 'register';
  const isForgot = auth === 'forgot';
  const isReset = auth === 'reset';
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const heading = isForgot ? 'Reset your password' : isReset ? 'Create a new password' : isRegister ? 'Create your account' : 'Welcome back';
  const subtitle = isForgot ? 'We will send you a link to reset your password.' : isReset ? 'Choose a strong password for your account.' : isRegister ? 'Join our community and share healthy meals.' : 'Sign in to continue your healthy journey.';

  return (
    <div className="min-h-screen bg-[#f5f8f3] px-4 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto mb-6 flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#477d52] text-white"><Leaf size={23} /></span>
          <div><p className="text-xl font-black tracking-tight text-[#203b2a]">NutriShare</p><p className="text-[10px] font-semibold tracking-[0.22em] text-stone-400">EAT WELL, LIVE WELL</p></div>
        </div>
        <button type="button" onClick={close} className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-50"><ChevronLeft size={16} /> Back to home</button>
      </div>

      <div className="mx-auto grid min-h-[min(760px,calc(100vh-120px))] max-w-7xl overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_80px_rgba(37,69,45,0.10)] lg:grid-cols-[1.02fr_0.98fr]">
        <section className="relative hidden overflow-hidden bg-[#315f40] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
          <div className="absolute -right-24 -top-20 h-80 w-80 rounded-full border-[50px] border-white/5" />
          <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#8caf75]/20 blur-2xl" />
          <div className="relative z-10 flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15"><Leaf size={25} /></span><span className="text-lg font-bold tracking-wide">NUTRISHARE COMMUNITY</span></div>
          <div className="relative z-10 max-w-lg"><p className="mb-5 text-xs font-bold tracking-[0.25em] text-[#d7e8c9]">GOOD FOOD. GOOD MOOD.</p><h1 className="text-5xl font-black leading-[1.12] xl:text-6xl">Share food.<br />Grow healthier<br /><span className="text-[#c8dda9]">together.</span></h1><p className="mt-7 max-w-md text-base leading-7 text-white/75">Discover nourishing recipes, share your kitchen creations, and inspire a healthier community every day.</p></div>
          <div className="relative z-10 flex items-center gap-3 text-sm text-white/70"><span className="h-px w-10 bg-[#c8dda9]" /> Small steps matter. Every healthy choice counts.</div>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-12 lg:px-14 xl:px-20">
          <form onSubmit={submitAuth} className="w-full max-w-md">
            <div className="mb-9 lg:hidden"><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#477d52] text-white"><Leaf size={25} /></div><p className="text-xs font-bold tracking-[0.2em] text-[#477d52]">NUTRISHARE COMMUNITY</p></div>
            <p className="mb-3 text-sm font-bold text-[#5f8a61]">{isRegister ? 'GET STARTED' : isForgot || isReset ? 'ACCOUNT RECOVERY' : 'WELCOME BACK'}</p>
            <h2 className="text-3xl font-black tracking-tight text-[#24382a] sm:text-4xl">{heading}</h2><p className="mt-3 mb-8 text-sm leading-6 text-stone-500">{subtitle}</p>

            {isRegister && <label className="mb-4 block text-sm font-semibold text-stone-700">Full name<input required type="text" placeholder="Enter your name" className="mt-2 w-full rounded-xl border border-stone-200 bg-[#fbfcfa] px-4 py-3.5 text-sm outline-none focus:border-[#6b9a6b] focus:ring-4 focus:ring-green-100" value={authForm.name} onChange={e => setAuthForm(prev => ({ ...prev, name: e.target.value }))} /></label>}
            <label className="mb-4 block text-sm font-semibold text-stone-700">Email address<input required type="email" placeholder="you@example.com" autoComplete="email" className="mt-2 w-full rounded-xl border border-stone-200 bg-[#fbfcfa] px-4 py-3.5 text-sm outline-none focus:border-[#6b9a6b] focus:ring-4 focus:ring-green-100" value={authForm.email} onChange={e => setAuthForm(prev => ({ ...prev, email: e.target.value }))} /></label>
            {isReset && <label className="mb-4 block text-sm font-semibold text-stone-700">Reset token<input required type="text" placeholder="Enter reset token" className="mt-2 w-full rounded-xl border border-stone-200 bg-[#fbfcfa] px-4 py-3.5 text-sm outline-none focus:border-[#6b9a6b]" value={authForm.token || ''} onChange={e => setAuthForm(prev => ({ ...prev, token: e.target.value }))} /></label>}
            {!isForgot && <label className="mb-4 block text-sm font-semibold text-stone-700">{isReset ? 'New password' : 'Password'}<span className="relative mt-2 block"><input required type={showPassword ? 'text' : 'password'} minLength={8} autoComplete={isRegister || isReset ? 'new-password' : 'current-password'} placeholder="Enter your password" className="w-full rounded-xl border border-stone-200 bg-[#fbfcfa] px-4 py-3.5 pr-12 text-sm outline-none focus:border-[#6b9a6b] focus:ring-4 focus:ring-green-100" value={authForm.password} onChange={e => setAuthForm(prev => ({ ...prev, password: e.target.value }))} /><button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400" aria-label="Toggle password visibility">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label>}
            {(isRegister || isReset) && <label className="mb-4 block text-sm font-semibold text-stone-700">Confirm password<span className="relative mt-2 block"><input required type={showConfirmPassword ? 'text' : 'password'} minLength={8} autoComplete="new-password" placeholder="Confirm your password" className="w-full rounded-xl border border-stone-200 bg-[#fbfcfa] px-4 py-3.5 pr-12 text-sm outline-none focus:border-[#6b9a6b] focus:ring-4 focus:ring-green-100" value={authForm.password_confirmation} onChange={e => setAuthForm(prev => ({ ...prev, password_confirmation: e.target.value }))} /><button type="button" onClick={() => setShowConfirmPassword(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400" aria-label="Toggle confirm password visibility">{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label>}
            {error && <p role="alert" className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
            {auth === 'login' && <div className="mb-6 flex justify-end"><button type="button" className="text-sm font-bold text-[#477d52] hover:underline" onClick={() => { setAuth('forgot'); setError(''); }}>Forgot password?</button></div>}
            <button type="submit" className="w-full rounded-xl bg-[#477d52] py-4 text-sm font-bold text-white shadow-lg shadow-green-900/10 transition hover:bg-[#386744] focus:outline-none focus:ring-4 focus:ring-green-200">{isForgot ? 'Send reset link' : isReset ? 'Reset password' : isRegister ? 'Create account' : 'Sign in'}</button>
            <p className="mt-7 text-center text-sm text-stone-500">{isForgot || isReset ? 'Remember your password?' : isRegister ? 'Already have an account?' : 'New to NutriShare?'}{' '}<button type="button" className="font-extrabold text-[#477d52] hover:underline" onClick={() => { setAuth(isForgot || isReset || isRegister ? 'login' : 'register'); setError(''); }}>{isForgot || isReset || isRegister ? 'Sign in' : 'Register'}</button></p>
            <p className="mt-10 text-center text-xs text-stone-400">© {new Date().getFullYear()} NutriShare. Eat well, live well.</p>
          </form>
        </section>
      </div>
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
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (!file) {
      setPreview('');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (modal !== 'post') return null;

  const update = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const fieldClass =
    'mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-leaf-500 focus:bg-white focus:ring-4 focus:ring-leaf-100';

  const labelClass = 'block text-sm font-semibold text-stone-700';

  const currentImage = preview || (active?.image ? imageUrl(active.image) : '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-3 backdrop-blur-sm sm:p-6">
      <form
        onSubmit={savePost}
        className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] bg-[#fbfdf9] shadow-2xl"
      >
        {/* Header */}
        <div className="relative flex shrink-0 items-center justify-between border-b border-leaf-100 bg-white px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-leaf-100 text-leaf-700">
              <Utensils size={23} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-leaf-700">
                NutriShare Community
              </p>
              <h2 className="mt-1 text-xl font-extrabold text-stone-900 sm:text-2xl">
                {active ? 'Edit your recipe' : 'Share a healthy recipe'}
              </h2>
              <p className="mt-1 hidden text-sm text-stone-500 sm:block">
                Inspire the community with something delicious and nourishing.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={close}
            aria-label="Close recipe form"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-stone-100 text-stone-500 transition hover:bg-rose-50 hover:text-rose-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable form body */}
        <div className="overflow-y-auto px-5 py-6 sm:px-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">

            {/* Main fields */}
            <div className="space-y-6">
              <section className="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5">
                  <h3 className="font-bold text-stone-900">Recipe information</h3>
                  <p className="mt-1 text-xs text-stone-500">
                    Start with a clear name and a short description.
                  </p>
                </div>

                <label className={labelClass}>
                  Recipe title <span className="text-rose-500">*</span>
                  <input
                    required
                    maxLength={150}
                    placeholder="e.g. Fresh green smoothie bowl"
                    className={fieldClass}
                    value={form.title || ''}
                    onChange={e => update('title', e.target.value)}
                  />
                </label>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <label className={labelClass}>
                    Category <span className="text-rose-500">*</span>
                    <select
                      required
                      className={fieldClass}
                      value={form.category_id || ''}
                      onChange={e => update('category_id', e.target.value)}
                    >
                      <option value="">Choose a category</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </label>

                  <label className={labelClass}>
                    Description <span className="text-rose-500">*</span>
                    <input
                      required
                      maxLength={500}
                      placeholder="What makes this recipe special?"
                      className={fieldClass}
                      value={form.description || ''}
                      onChange={e => update('description', e.target.value)}
                    />
                  </label>
                </div>
              </section>

              <section className="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5">
                  <h3 className="font-bold text-stone-900">Ingredients & method</h3>
                  <p className="mt-1 text-xs text-stone-500">
                    Add ingredients and explain how to prepare your recipe.
                  </p>
                </div>

                <label className={labelClass}>
                  Ingredients
                  <textarea
                    rows={4}
                    placeholder={'Example:\n• 1 cup spinach\n• 1 banana\n• 200 ml milk'}
                    className={`${fieldClass} resize-y`}
                    value={form.ingredients || ''}
                    onChange={e => update('ingredients', e.target.value)}
                  />
                </label>

                <label className={`${labelClass} mt-5`}>
                  Cooking instructions
                  <textarea
                    rows={5}
                    placeholder={'Write the steps in order:\n1. Prepare the ingredients.\n2. Mix or cook them as needed.'}
                    className={`${fieldClass} resize-y`}
                    value={form.instructions || ''}
                    onChange={e => update('instructions', e.target.value)}
                  />
                </label>
              </section>

              <section className="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5">
                  <h3 className="font-bold text-stone-900">Nutrition & preparation</h3>
                  <p className="mt-1 text-xs text-stone-500">
                    Add approximate values to help readers plan their meals.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {[
                    ['prep_minutes', 'Prep time', 'min'],
                    ['cook_minutes', 'Cook time', 'min'],
                    ['servings', 'Servings', 'people'],
                    ['calories', 'Calories', 'kcal'],
                    ['protein', 'Protein', 'g'],
                    ['carbs', 'Carbs', 'g'],
                    ['fat', 'Fat', 'g']
                  ].map(([key, label, unit]) => (
                    <label key={key} className={labelClass}>
                      {label}
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          step="1"
                          className={`${fieldClass} pr-14`}
                          value={form[key] ?? 0}
                          onChange={e => update(key, e.target.value)}
                        />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-stone-400">
                          {unit}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </section>
            </div>

            {/* Image upload side panel */}
            <aside className="space-y-4">
              <section className="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm">
                <div className="mb-4">
                  <h3 className="font-bold text-stone-900">Food photo</h3>
                  <p className="mt-1 text-xs leading-5 text-stone-500">
                    Choose a bright, clear photo of your finished dish.
                  </p>
                </div>

                <label className="group relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-leaf-200 bg-leaf-50/60 text-center transition hover:border-leaf-500 hover:bg-leaf-50">
                  {currentImage ? (
                    <>
                      <img
                        src={currentImage}
                        alt="Recipe preview"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-stone-950/60 px-3 py-3 text-sm font-semibold text-white">
                        Change photo
                      </div>
                    </>
                  ) : (
                    <div className="px-4 py-8">
                      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-leaf-700 shadow-sm">
                        <ImagePlus size={27} />
                      </span>
                      <p className="mt-4 text-sm font-bold text-stone-700">
                        Upload food photo
                      </p>
                      <p className="mt-1 text-xs text-stone-500">
                        JPG, PNG or WEBP
                      </p>
                      <p className="mt-3 text-xs font-semibold text-leaf-700">
                        Browse files
                      </p>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                  />
                </label>

                {file && (
                  <div className="mt-3 flex items-center justify-between gap-2 rounded-xl bg-leaf-50 px-3 py-2">
                    <p className="truncate text-xs font-medium text-leaf-800">
                      {file.name}
                    </p>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="shrink-0 text-xs font-bold text-rose-600"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </section>

              <div className="rounded-2xl bg-leaf-100/70 p-5">
                <div className="flex items-center gap-2 text-leaf-800">
                  <Leaf size={18} />
                  <p className="text-sm font-bold">Sharing tip</p>
                </div>
                <p className="mt-2 text-xs leading-5 text-leaf-900/80">
                  Include clear ingredients and simple steps. Add nutrition information when available so other members can make informed food choices.
                </p>
              </div>
            </aside>
          </div>
        </div>

        {/* Sticky footer */}
        <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-stone-100 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="hidden text-xs text-stone-400 sm:block">
            Fields marked <span className="text-rose-500">*</span> are required.
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={close}
              className="rounded-xl border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-600 transition hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-leaf-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-leaf-700 focus:outline-none focus:ring-4 focus:ring-leaf-200"
            >
              <CheckCircle2 size={17} />
              {active ? 'Save changes' : 'Publish recipe'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

// ==========================================
// RECIPE DETAIL MODAL
// IMPORTANT: OUTSIDE APP
// ==========================================

function DetailModal({ modal, active, user, toggleLike, toggleBookmark, flash, setActive, close }) {
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(Number(active?.my_rating || 0));
  const [saving, setSaving] = useState(false);
  useEffect(() => { setRating(Number(active?.my_rating || 0)); setCommentText(''); }, [active?.id]);
  if (modal !== 'detail' || !active) return null;

  const refreshPost = async () => {
    const r = await api.get(`/posts/${active.id}`);
    setActive(r.data);
  };
  const reportPost = async () => {
    const reason = window.prompt('Why are you reporting this post?');
    if (!reason?.trim()) return;
    try { await api.post(`/posts/${active.id}/reports`, { reason }); flash('Report submitted to admin'); }
    catch (e) { flash(e.response?.data?.message || 'Could not submit report'); }
  };
  const addComment = async e => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSaving(true);
    try { await api.post(`/posts/${active.id}/comments`, { body: commentText.trim() }); setCommentText(''); await refreshPost(); flash('Comment added'); }
    catch (e) { flash(e.response?.data?.message || 'Could not add comment'); }
    finally { setSaving(false); }
  };
  const editComment = async c => {
    const body = window.prompt('Edit your comment', c.body || '');
    if (!body?.trim() || body.trim() === c.body) return;
    try { await api.put(`/comments/${c.id}`, { body: body.trim() }); await refreshPost(); flash('Comment updated'); }
    catch (e) { flash(e.response?.data?.message || 'Comment edit API is not available'); }
  };
  const deleteComment = async c => {
    if (!window.confirm('Delete this comment?')) return;
    try { await api.delete(`/comments/${c.id}`); await refreshPost(); flash('Comment deleted'); }
    catch (e) { flash(e.response?.data?.message || 'Comment delete API is not available'); }
  };
  const submitRating = async value => {
    setRating(value);
    try { await api.post(`/posts/${active.id}/ratings`, { rating: value }); await refreshPost(); flash('Thank you for rating'); }
    catch (e) { flash(e.response?.data?.message || 'Could not submit rating'); }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-3">
      <div className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white">
        <div className="relative">
          <img src={imageUrl(active.image)} onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900'; }} alt={active.title} className="h-64 w-full object-cover" />
          <button onClick={close} className="absolute right-3 top-3 rounded-full bg-white p-2"><X /></button>
        </div>
        <div className="p-6">
          <span className="rounded-full bg-leaf-50 px-3 py-1 text-xs font-bold text-leaf-700">{active.category?.name || 'Recipe'}</span>
          <h2 className="mt-3 text-2xl font-extrabold">{active.title}</h2>
          <p className="mt-1 text-xs text-stone-400">By {active.user?.name || 'Community member'} · {active.created_at ? new Date(active.created_at).toLocaleDateString() : ''}</p>
          <div className="mt-2 flex items-center gap-1 text-amber-500"><Star size={16} fill="currentColor"/><b>{active.average_rating || 'New'}</b><span className="text-xs text-stone-400">({active.ratings_count || active.ratings?.length || 0} ratings)</span></div>
          <p className="mt-3 text-sm leading-6 text-stone-600">{active.description}</p>
          <div className="my-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[['Calories', `${active.calories ?? 0} kcal`], ['Protein', `${active.protein ?? 0}g`], ['Carbs', `${active.carbs ?? 0}g`], ['Fat', `${active.fat ?? 0}g`]].map(([label,value]) => <div key={label} className="rounded-xl bg-leaf-50 p-3 text-center"><p className="text-xs text-stone-500">{label}</p><b className="text-leaf-700">{value}</b></div>)}
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div><h3 className="font-bold">Ingredients</h3><p className="mt-2 whitespace-pre-line text-sm text-stone-600">{active.ingredients || 'No ingredients provided.'}</p><p className="mt-4 text-xs text-stone-500">Prep {active.prep_minutes} min · Cook {active.cook_minutes} min · Serves {active.servings}</p></div>
            <div><h3 className="font-bold">Cooking instructions</h3><p className="mt-2 whitespace-pre-line text-sm text-stone-600">{active.instructions || 'No instructions provided.'}</p></div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2 border-t pt-4">
            
<button
  onClick={() => toggleLike(active)}
  className={`rounded-xl border px-4 py-2 flex items-center gap-2 transition ${
    active.is_liked
      ? 'bg-rose-50 border-rose-300 text-rose-600'
      : 'border-stone-200 text-stone-600 hover:bg-rose-50'
  }`}
>
  <span className="text-lg">
    {active.is_liked ? '❤️' : '♡'}
  </span>

  <span className="font-medium">
    Like
  </span>

  <span className="font-bold">
    {active.likes_count ?? 0}
  </span>
</button>

            <button onClick={() => toggleBookmark(active)} className="rounded-xl border px-4 py-2 text-sm"><Bookmark size={16} className="mr-1 inline"/>Save</button>
            {user && <button onClick={reportPost} className="rounded-xl border px-4 py-2 text-sm text-rose-600">Report</button>}
          </div>
          {user && <section className="mt-5 rounded-2xl bg-amber-50 p-4"><h3 className="font-bold">Rate this recipe</h3><div className="mt-2 flex gap-2">{[1,2,3,4,5].map(n => <button type="button" key={n} onClick={() => submitRating(n)} aria-label={`Rate ${n} stars`} className="transition hover:scale-110"><Star size={28} fill={n <= rating ? '#f59e0b' : 'none'} className={n <= rating ? 'text-amber-500' : 'text-stone-300'}/></button>)}</div><p className="mt-1 text-xs text-stone-500">Choose 1–5 stars.</p></section>}
          <section className="mt-6 border-t pt-5">
            <h3 className="font-bold">Comments ({active.comments?.length || 0})</h3>
            {user && <form onSubmit={addComment} className="mt-3 flex gap-2"><input value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Write a comment..." className="min-w-0 flex-1 rounded-xl border px-3 py-2 text-sm"/><button disabled={saving || !commentText.trim()} className="rounded-xl bg-leaf-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">{saving ? 'Sending...' : 'Post'}</button></form>}
            {(active.comments || []).map(c => <div key={c.id} className="mt-3 flex items-start justify-between gap-3 rounded-xl bg-stone-50 p-3"><div className="min-w-0"><b className="text-sm">{c.user?.name || 'User'}</b><p className="mt-1 whitespace-pre-wrap text-sm text-stone-600">{c.body}</p></div>{(user?.id === c.user_id || user?.id === c.user?.id || user?.role === 'admin') && <div className="flex shrink-0 gap-2"><button onClick={() => editComment(c)} className="text-xs font-bold text-blue-600">Edit</button><button onClick={() => deleteComment(c)} className="text-xs font-bold text-rose-600">Delete</button></div>}</div>)}
            {(!active.comments || active.comments.length === 0) && <p className="mt-2 text-sm text-stone-400">No comments yet.</p>}
          </section>
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
// PROFILE PANEL
// ==========================================
function ProfilePanel({
  user,
  setUser,
  flash,
  posts = [],
  openDetails,
  toggleLike,
  toggleBookmark,
  openCreate,
  removePost
}) {
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || ''
  });
  const [loading, setLoading] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    setForm({
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || ''
    });
  }, [user]);

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview('');
      return;
    }
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  const myPosts = posts.filter(post =>
    Number(post.user_id) === Number(user?.id)
  );

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) =>
        payload.append(key, value ?? '')
      );
      if (avatarFile) payload.append('avatar', avatarFile);

      const response = await api.post('/profile', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const updatedUser = response.data.user || response.data;
      setUser(updatedUser);
      localStorage.setItem('nutri_user', JSON.stringify(updatedUser));
      setAvatarFile(null);
      setShowEditForm(false);
      flash('Profile updated successfully');
    } catch (error) {
      flash(
        error.response?.data?.message ||
        'Could not update profile. Check the profile API route.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-7">
      {/* Profile header */}
      <section className="overflow-hidden rounded-3xl border border-leaf-100 bg-white shadow-sm">
        <div className="h-28 bg-gradient-to-r from-leaf-700 via-leaf-600 to-lime-500 sm:h-36" />
        <div className="px-5 pb-6 sm:px-8">
          <div className="-mt-12 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-3xl border-4 border-white bg-leaf-100 text-3xl font-extrabold text-leaf-700 shadow-md">
                {avatarPreview || user?.avatar ? (
                  <img
                    src={avatarPreview || imageUrl(user.avatar)}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  user?.name?.slice(0, 1)?.toUpperCase()
                )}
              </div>
              <div className="pb-1">
                <h2 className="text-xl font-extrabold text-stone-900 sm:text-2xl">
                  {user?.name || 'NutriShare Member'}
                </h2>
                <p className="mt-1 text-sm text-stone-500">{user?.email}</p>
                <span className="mt-2 inline-flex rounded-full bg-leaf-50 px-3 py-1 text-xs font-bold capitalize text-leaf-700">
                  {user?.role || 'Member'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowEditForm(value => !value)}
              className="rounded-xl border border-leaf-200 px-4 py-2.5 text-sm font-bold text-leaf-700 transition hover:bg-leaf-50"
            >
              {showEditForm ? 'Close editor' : 'Edit profile'}
            </button>
          </div>

          {user?.bio && (
            <p className="mt-5 max-w-2xl text-sm leading-6 text-stone-600">
              {user.bio}
            </p>
          )}

          <div className="mt-6 grid max-w-md grid-cols-2 gap-3">
            <div className="rounded-2xl bg-leaf-50 p-4">
              <p className="text-xs font-semibold text-stone-500">My recipes</p>
              <p className="mt-1 text-2xl font-extrabold text-leaf-800">{myPosts.length}</p>
            </div>
            <div className="rounded-2xl bg-stone-50 p-4">
              <p className="text-xs font-semibold text-stone-500">Member since</p>
              <p className="mt-1 text-sm font-bold text-stone-800">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'NutriShare'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Profile edit: shown only after clicking Edit profile */}
      {showEditForm && (
      <section id="profile-edit-form" className="rounded-3xl border border-stone-100 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5">
          <h3 className="text-lg font-extrabold text-stone-900">Profile information</h3>
          <p className="mt-1 text-sm text-stone-500">Update your account details and profile photo.</p>
        </div>

        <form onSubmit={updateProfile} className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-semibold text-stone-700 md:col-span-2">
            Profile photo
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={e => setAvatarFile(e.target.files?.[0] || null)}
              className="mt-2 block w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm"
            />
          </label>

          <label className="block text-sm font-semibold text-stone-700">
            Full name
            <input
              required
              value={form.name}
              onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-stone-200 p-3 text-sm outline-none focus:border-leaf-500"
            />
          </label>

          <label className="block text-sm font-semibold text-stone-700">
            Email address
            <input
              required
              type="email"
              value={form.email}
              onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-stone-200 p-3 text-sm outline-none focus:border-leaf-500"
            />
          </label>

          <label className="block text-sm font-semibold text-stone-700 md:col-span-2">
            About me
            <textarea
              rows={3}
              value={form.bio}
              onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell the community about yourself..."
              className="mt-2 w-full rounded-xl border border-stone-200 p-3 text-sm outline-none focus:border-leaf-500"
            />
          </label>

          <div className="flex flex-wrap items-center gap-3 md:col-span-2">
            <button
              disabled={loading}
              className="rounded-xl bg-leaf-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-leaf-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save profile'}
            </button>
            {avatarFile && (
              <button
                type="button"
                onClick={() => setAvatarFile(null)}
                className="text-sm font-semibold text-stone-500 hover:text-rose-600"
              >
                Remove selected photo
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowEditForm(false)}
              className="rounded-xl border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-600 hover:bg-stone-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
      )}

      {/* User's own posts on the same profile page */}
      <section>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-extrabold text-stone-900">My shared recipes</h3>
            <p className="mt-1 text-sm text-stone-500">
              All recipes you have shared with the NutriShare community.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="rounded-xl bg-leaf-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-leaf-700"
          >
            + Share a recipe
          </button>
        </div>

        {myPosts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-leaf-200 bg-white px-5 py-12 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-leaf-50 text-leaf-700">
              <Utensils size={25} />
            </div>
            <h4 className="mt-4 font-bold text-stone-800">You haven't shared a recipe yet</h4>
            <p className="mt-1 text-sm text-stone-500">
              Share your first healthy recipe with the community.
            </p>
            <button
              type="button"
              onClick={openCreate}
              className="mt-4 rounded-xl bg-leaf-600 px-5 py-2.5 text-sm font-bold text-white"
            >
              Create your first recipe
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {myPosts.map(post => (
              <RecipeCard
                key={post.id}
                p={post}
                user={user}
                isAdmin={false}
                openDetails={openDetails}
                toggleLike={toggleLike}
                toggleBookmark={toggleBookmark}
                openCreate={openCreate}
                removePost={removePost}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ==========================================
// NOTIFICATION PANEL
// ==========================================
function NotificationPanel({
  items = [],
  loading = false,
  markAsRead,
  markAllAsRead,
  openNotification
}) {
  const unreadCount = items.filter(item => !item.read_at && !item.read).length;

  if (loading && items.length === 0) {
    return <div className="rounded-2xl bg-white p-8 text-center text-stone-500">Loading notifications...</div>;
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold">All notifications</h2>
          <p className="text-sm text-stone-400">{unreadCount} unread · {items.length} total notifications</p>
        </div>
        <button type="button" onClick={markAllAsRead} disabled={unreadCount === 0}
          className="rounded-xl border border-leaf-200 px-4 py-2 text-sm font-bold text-leaf-700 hover:bg-leaf-50 disabled:opacity-40">
          Mark all as read
        </button>
      </div>

      {items.length === 0 ? (
        <div className="py-12 text-center">
          <Bell size={35} className="mx-auto text-stone-300" />
          <p className="mt-3 font-bold">No notifications yet</p>
          <p className="mt-1 text-sm text-stone-400">Likes, comments, ratings and new recipes will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => {
            const data = item.data || {};
            const isUnread = !item.read_at && !item.read;
            const message = data.message || item.message || data.body || 'You have a new notification.';
            const created = item.created_at ? new Date(item.created_at).toLocaleString() : 'Date unavailable';
            return (
              <article key={item.id} className={`rounded-2xl border p-4 ${isUnread ? 'border-leaf-200 bg-leaf-50/60' : 'border-stone-100 bg-white'}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <button type="button" onClick={() => openNotification(item)} className="flex min-w-0 flex-1 items-start gap-3 text-left">
                    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-leaf-700"><Bell size={18}/></span>
                    <span className="min-w-0">
                      <span className="block font-bold text-stone-800">{data.title || item.title || 'NutriShare update'}</span>
                      <span className="mt-1 block text-sm leading-6 text-stone-600">{message}</span>
                      <span className="mt-2 block text-xs text-stone-400">{created}</span>
                    </span>
                  </button>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${isUnread ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}`}>{isUnread ? 'Unread' : 'Read'}</span>
                    {isUnread && <button type="button" onClick={() => markAsRead(item)} className="text-xs font-bold text-leaf-700">Mark read</button>}
                  </div>
                </div>
                <details className="mt-3 rounded-xl bg-white/80 px-3 py-2">
                  <summary className="cursor-pointer text-xs font-bold text-leaf-700">View notification data</summary>
                  <div className="mt-3 grid gap-2 text-xs text-stone-600 sm:grid-cols-2">
                    <p><b>Notification ID:</b> {item.id ?? '—'}</p>
                    <p><b>Type:</b> {item.type || data.type || 'Community activity'}</p>
                    <p><b>From:</b> {data.actor_name || data.user_name || '—'}</p>
                    <p><b>Recipe:</b> {data.post_title || data.recipe_title || '—'}</p>
                    <p><b>Recipe ID:</b> {data.post_id || item.post_id || '—'}</p>
                    <p><b>Created:</b> {created}</p>
                    <p><b>Status:</b> {isUnread ? 'Unread' : 'Read'}</p>
                    <p><b>Read at:</b> {item.read_at ? new Date(item.read_at).toLocaleString() : '—'}</p>
                  </div>
                  <pre className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-stone-50 p-3 text-[10px] text-stone-600">{JSON.stringify(data, null, 2)}</pre>
                </details>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ==========================================
// ADMIN PANEL
// ==========================================
function AdminPanel({ page, stats, users, reports, categories, posts, adminLoad, flash, setCategories, RecipeCardComponent }) {
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [postSearch, setPostSearch] = useState('');
  const [usersPage, setUsersPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const USERS_PAGE_SIZE = 8;

  // Additional admin tools. These use dedicated Laravel admin endpoints.
  const [adminComments, setAdminComments] = useState([]);
  const [adminHabits, setAdminHabits] = useState([]);
  const [adminDataLoading, setAdminDataLoading] = useState(false);
  const [adminDataError, setAdminDataError] = useState('');
  const [commentSearch, setCommentSearch] = useState('');
  const [habitSearch, setHabitSearch] = useState('');
  const [reportSearch, setReportSearch] = useState('');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationAudience, setNotificationAudience] = useState('all');
  const [sendingNotification, setSendingNotification] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => { setUsersPage(1); }, [userSearch, roleFilter, statusFilter]);

  useEffect(() => {
    let mounted = true;
    const loadAdminPageData = async () => {
      setAdminDataError('');
      if (!['comments', 'habits'].includes(page)) return;
      setAdminDataLoading(true);
      try {
        const endpoint = page === 'comments' ? '/admin/comments' : '/admin/habits';
        const response = await api.get(endpoint);
        const payload = response.data?.data ?? response.data?.items ?? response.data;
        if (!mounted) return;
        if (page === 'comments') setAdminComments(Array.isArray(payload) ? payload : []);
        if (page === 'habits') setAdminHabits(Array.isArray(payload) ? payload : []);
      } catch (error) {
        if (mounted) {
          setAdminDataError(
            error.response?.data?.message ||
            `Could not load ${page}. Add the ${page === 'comments' ? 'GET /api/admin/comments' : 'GET /api/admin/habits'} Laravel endpoint to enable this page.`
          );
        }
      } finally {
        if (mounted) setAdminDataLoading(false);
      }
    };
    loadAdminPageData();
    return () => { mounted = false; };
  }, [page]);

  if (page === 'dashboard') {
    const userGrowth = stats?.charts?.user_growth || [];
    const postActivity = stats?.charts?.post_activity || [];
    const categoryBreakdown = stats?.charts?.posts_by_category || [];
    const maxUsers = Math.max(1, ...userGrowth.map(x => Number(x.total || 0)));
    const maxPosts = Math.max(1, ...postActivity.map(x => Number(x.total || 0)));
    const maxCategory = Math.max(1, ...categoryBreakdown.map(x => Number(x.total || 0)));
    const linePoints = userGrowth.map((x, i) => `${userGrowth.length <= 1 ? 20 : 20 + i * (260 / (userGrowth.length - 1))},${105 - (Number(x.total || 0) / maxUsers) * 85}`).join(' ');
    return <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[['Members', stats?.users, Users], ['Food posts', stats?.posts, Utensils], ['Categories', stats?.categories, Leaf], ['Pending reports', stats?.reports, AlertTriangle]].map(([label, number, Icon]) => <div key={label} className="rounded-2xl bg-white p-6 shadow-sm"><Icon className="text-leaf-600" /><p className="mt-4 text-sm text-stone-500">{label}</p><b className="text-3xl">{number ?? '—'}</b></div>)}</div>
      <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-2xl bg-white p-5 shadow-sm"><div className="mb-4"><h3 className="font-extrabold">User Registration Trend</h3><p className="text-xs text-stone-400">New members per month · Last 6 months</p></div>{userGrowth.length ? <><svg viewBox="0 0 300 125" className="h-44 w-full overflow-visible" role="img" aria-label="User registration trend chart"><line x1="15" y1="105" x2="285" y2="105" stroke="#e7e5e4"/><line x1="15" y1="20" x2="285" y2="20" stroke="#f5f5f4"/><polyline points={linePoints} fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>{userGrowth.map((x,i) => <g key={x.month}><circle cx={userGrowth.length <= 1 ? 20 : 20+i*(260/(userGrowth.length-1))} cy={105-(Number(x.total||0)/maxUsers)*85} r="3.5" fill="#16a34a"/><text x={userGrowth.length <= 1 ? 20 : 20+i*(260/(userGrowth.length-1))} y="122" textAnchor="middle" fontSize="8" fill="#78716c">{x.label}</text></g>)}</svg><p className="text-right text-xs text-stone-400">Peak: {maxUsers} members</p></> : <p className="py-12 text-center text-sm text-stone-400">No registration data yet.</p>}</section>
        <section className="rounded-2xl bg-white p-5 shadow-sm"><div className="mb-4"><h3 className="font-extrabold">Food Posts by Category</h3><p className="text-xs text-stone-400">Recipe distribution across categories</p></div>{categoryBreakdown.length ? <div className="space-y-4">{categoryBreakdown.map(c => <div key={c.category}><div className="mb-1 flex justify-between text-sm"><span className="font-medium text-stone-700">{c.category}</span><b>{c.total}</b></div><div className="h-3 overflow-hidden rounded-full bg-stone-100"><div className="h-full rounded-full bg-leaf-600" style={{width:`${(Number(c.total||0)/maxCategory)*100}%`}}/></div></div>)}</div> : <p className="py-12 text-center text-sm text-stone-400">No category data yet.</p>}</section>
        <section className="rounded-2xl bg-white p-5 shadow-sm xl:col-span-2"><div className="mb-4"><h3 className="font-extrabold">Monthly Food Post Activity</h3><p className="text-xs text-stone-400">New recipes published per month · Last 6 months</p></div>{postActivity.length ? <div className="grid h-52 grid-cols-6 items-end gap-3 border-b border-stone-100 pb-2">{postActivity.map(x => <div key={x.month} className="flex h-full flex-col items-center justify-end gap-2"><span className="text-xs font-semibold text-stone-500">{x.total}</span><div className="w-full max-w-14 rounded-t-lg bg-leaf-500" style={{height:`${Math.max(3,(Number(x.total||0)/maxPosts)*135)}px`}}/><span className="text-[10px] text-stone-400">{x.label}</span></div>)}</div> : <p className="py-12 text-center text-sm text-stone-400">No post activity yet.</p>}</section>
      </div>
      <div className="flex justify-end"><button onClick={adminLoad} className="rounded-xl border px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-50">Refresh dashboard data</button></div>
    </div>;
  }

  if (page === 'users') {
    const filteredUsers = users.filter(u => {
      const matches = `${u.name || ''} ${u.email || ''} ${u.role || ''}`.toLowerCase().includes(userSearch.toLowerCase());
      const roleOk = roleFilter === 'all' || (u.role || 'member') === roleFilter;
      const statusOk = statusFilter === 'all' || (statusFilter === 'banned' ? Boolean(u.is_banned) : !u.is_banned);
      return matches && roleOk && statusOk;
    });
    const addUser = async () => {
      const name = window.prompt('New user full name');
      if (!name?.trim()) return;
      const email = window.prompt('New user email');
      if (!email?.trim()) return;
      const password = window.prompt('Temporary password (at least 8 characters)');
      if (!password || password.length < 8) { flash('Password must contain at least 8 characters'); return; }
      try {
        await api.post('/admin/users', { name: name.trim(), email: email.trim(), password, password_confirmation: password, role: 'member' });
        flash('User created');
        await adminLoad();
      } catch (e) { flash(e.response?.data?.message || 'Create-user API is not available'); }
    };
    const toggleBan = async (u) => {
      if (!window.confirm(`${u.is_banned ? 'Unban' : 'Ban'} ${u.name}?`)) return;
      try {
        await api.patch(`/admin/users/${u.id}/ban`, { is_banned: !Boolean(u.is_banned) });
        flash(u.is_banned ? 'User unbanned' : 'User banned');
        await adminLoad();
        setSelectedUser(prev => prev?.id === u.id ? { ...prev, is_banned: !Boolean(u.is_banned) } : prev);
      } catch (e) { flash(e.response?.data?.message || 'Could not update user status. Check backend route.'); }
    };
    const warnUser = async (u) => {
      const message = window.prompt(`Write a warning message for ${u.name}:`);
      if (!message?.trim()) return;
      try {
        await api.post(`/admin/users/${u.id}/warn`, { message: message.trim() });
        flash('Warning sent to user');
        await adminLoad();
      } catch (e) {
        flash(e.response?.data?.message || 'Warning API is not available. Add POST /api/admin/users/{id}/warn.');
      }
    };
    const deleteUser = async (u) => {
      if (!window.confirm(`Permanently delete ${u.name}?`)) return;
      try {
        await api.delete(`/admin/users/${u.id}`);
        setSelectedUser(prev => prev?.id === u.id ? null : prev);
        flash('User deleted');
        await adminLoad();
      } catch (e) { flash(e.response?.data?.message || 'Could not delete user.'); }
    };
    const changeRole = async (u, role) => {
      try {
        await api.patch(`/admin/users/${u.id}`, { role });
        flash('User role updated');
        await adminLoad();
        setSelectedUser(prev => prev?.id === u.id ? { ...prev, role } : prev);
      } catch (e) { flash(e.response?.data?.message || 'Could not update user role.'); }
    };
    return (
      <>
        <div className="rounded-2xl bg-white p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-bold">User management</h2>
              <p className="text-xs text-stone-400">{users.length} registered users</p>
            </div>
            <div className="flex w-full flex-wrap gap-2 sm:w-auto">
              <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search name or email..." className="min-w-[180px] flex-1 rounded-xl border px-3 py-2 text-sm" />
              <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="rounded-xl border px-3 py-2 text-sm">
                <option value="all">All roles</option><option value="admin">Admin</option><option value="member">Member</option>
              </select>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-xl border px-3 py-2 text-sm">
                <option value="all">All status</option><option value="active">Active</option><option value="banned">Banned</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="bg-stone-50 text-stone-500">
                <tr><th className="p-3">Member</th><th className="p-3">Role</th><th className="p-3">Status</th><th className="p-3">Joined</th><th className="p-3">Actions</th></tr>
              </thead>
              <tbody>
                {filteredUsers.slice((usersPage - 1) * USERS_PAGE_SIZE, usersPage * USERS_PAGE_SIZE).map(u => (
                  <tr key={u.id} className="border-b">
                    <td className="p-3"><div className="font-semibold">{u.name}</div><div className="text-xs text-stone-400">{u.email}</div></td>
                    <td className="p-3">
                      <select value={u.role || 'member'} onChange={e => changeRole(u, e.target.value)} disabled={u.role === 'admin'} className="rounded-lg border p-2 text-xs">
                        <option value="member">Member</option><option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-3"><span className={cx('rounded-full px-2 py-1 text-xs font-bold', u.is_banned ? 'bg-rose-100 text-rose-700' : 'bg-green-100 text-green-700')}>{u.is_banned ? 'Banned' : 'Active'}</span></td>
                    <td className="p-3 text-xs text-stone-500">{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => setSelectedUser(u)} className="inline-flex items-center gap-1 rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50">
                          <Eye size={14} /> View
                        </button>
                        {u.role !== 'admin' && <>
                          <button onClick={() => warnUser(u)} className="rounded-lg border border-amber-200 px-3 py-2 text-xs font-semibold text-amber-700">Warn</button>
                          <button onClick={() => toggleBan(u)} className="rounded-lg border px-3 py-2 text-xs font-semibold text-amber-700">{u.is_banned ? 'Unban' : 'Ban'}</button>
                          <button onClick={() => deleteUser(u)} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700">Delete</button>
                        </>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && <p className="py-8 text-center text-sm text-stone-400">No users found.</p>}
          <Pagination page={Math.min(usersPage, Math.max(1, Math.ceil(filteredUsers.length / USERS_PAGE_SIZE)))} totalPages={Math.max(1, Math.ceil(filteredUsers.length / USERS_PAGE_SIZE))} onChange={setUsersPage} />
        </div>

        {selectedUser && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-stone-950/50 p-4" onClick={() => setSelectedUser(null)}>
            <section role="dialog" aria-modal="true" aria-labelledby="user-detail-title" onClick={e => e.stopPropagation()} className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-leaf-700">NutriShare Admin</p>
                  <h2 id="user-detail-title" className="mt-1 text-xl font-extrabold text-stone-900">User details</h2>
                  <p className="mt-1 text-sm text-stone-500">View account information for this member.</p>
                </div>
                <button type="button" onClick={() => setSelectedUser(null)} aria-label="Close user details" className="rounded-full p-2 text-stone-500 hover:bg-stone-100"><X size={20} /></button>
              </div>
              <div className="mb-5 flex items-center gap-4 rounded-2xl bg-leaf-50 p-4">
                <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white text-xl font-extrabold text-leaf-700">
                  {selectedUser.avatar
                    ? <img src={imageUrl(selectedUser.avatar)} alt={`${selectedUser.name || 'User'} profile`} className="h-full w-full object-cover" />
                    : (selectedUser.name || 'U').slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-bold text-stone-900">{selectedUser.name || 'Unnamed user'}</h3>
                  <p className="break-all text-sm text-stone-500">{selectedUser.email || 'No email available'}</p>
                  <span className={cx('mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-bold', selectedUser.is_banned ? 'bg-rose-100 text-rose-700' : 'bg-green-100 text-green-700')}>
                    {selectedUser.is_banned ? 'Banned' : 'Active'}
                  </span>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ['User ID', selectedUser.id ?? '—'],
                  ['Role', selectedUser.role || 'member'],
                  ['Joined date', selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleString() : '—'],
                
    
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-stone-100 p-3">
                    <p className="text-xs font-semibold text-stone-400">{label}</p>
                    <p className="mt-1 break-words text-sm font-semibold capitalize text-stone-800">{value}</p>
                  </div>
                ))}
                <div className="rounded-xl border border-stone-100 p-3 sm:col-span-2">
                  <p className="text-xs font-semibold text-stone-400">About / Bio</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-stone-700">{selectedUser.bio || 'No bio provided.'}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button type="button" onClick={() => setSelectedUser(null)} className="rounded-xl bg-leaf-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-leaf-700">Close</button>
              </div>
            </section>
          </div>
        )}
      </>
    );
  }

  if (page === 'reports') {
    const filteredReports = reports.filter(r =>
      `${r.post?.title || ''} ${r.reason || ''} ${r.user?.name || r.reporter?.name || ''}`
        .toLowerCase().includes(reportSearch.toLowerCase())
    );
    const resolveReport = async (report) => {
      try {
        await api.patch(`/admin/reports/${report.id}/resolve`);
        flash('Report resolved');
        setSelectedReport(null);
        await adminLoad();
      } catch (e) {
        flash(e.response?.data?.message || 'Could not resolve report');
      }
    };
    const rejectReport = async (report) => {
      if (!window.confirm('Reject this report? The reported post will remain unchanged.')) return;
      try {
        await api.patch(`/admin/reports/${report.id}/reject`);
        flash('Report rejected');
        setSelectedReport(null);
        await adminLoad();
      } catch (e) {
        flash(e.response?.data?.message || 'Reject action requires PATCH /api/admin/reports/{id}/reject.');
      }
    };
    return (
      <div className="space-y-4">
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div><h2 className="font-bold">Reported posts</h2><p className="text-xs text-stone-400">{reports.length} reports received</p></div>
            <input value={reportSearch} onChange={e => setReportSearch(e.target.value)} placeholder="Search post, reason or reporter..." className="w-full max-w-sm rounded-xl border px-3 py-2 text-sm"/>
          </div>
          <div className="space-y-3">
            {filteredReports.map(r => (
              <article key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-100 p-4">
                <div className="min-w-0">
                  <p className="font-semibold text-stone-800">{r.post?.title || 'Unknown post'}</p>
                  <p className="mt-1 text-sm text-stone-500">Reason: {r.reason || 'Not provided'}</p>
                  <p className="mt-1 text-xs text-stone-400">Reported by: {r.user?.name || r.reporter?.name || 'Member'} · {r.created_at ? new Date(r.created_at).toLocaleString() : 'Date unavailable'}</p>
                  <span className="mt-2 inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">{r.status || 'Pending'}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setSelectedReport(r)} className="rounded-lg border px-3 py-2 text-xs font-semibold text-blue-700">View details</button>
                  <button onClick={() => resolveReport(r)} className="rounded-lg bg-leaf-600 px-3 py-2 text-xs font-bold text-white">Resolve</button>
                  <button onClick={() => rejectReport(r)} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700">Reject</button>
                </div>
              </article>
            ))}
            {filteredReports.length === 0 && <p className="py-8 text-center text-sm text-stone-400">No reports found.</p>}
          </div>
        </section>
        {selectedReport && (
          <div className="fixed inset-0 z-[75] grid place-items-center bg-stone-950/50 p-4" onClick={() => setSelectedReport(null)}>
            <section role="dialog" aria-modal="true" className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-widest text-leaf-700">Report review</p><h3 className="mt-1 text-xl font-extrabold">{selectedReport.post?.title || 'Reported post'}</h3></div><button onClick={() => setSelectedReport(null)} aria-label="Close" className="rounded-full p-2 hover:bg-stone-100"><X size={18}/></button></div>
              <div className="mt-4 space-y-3 text-sm">
                <p><b>Report ID:</b> {selectedReport.id}</p>
                <p><b>Reason:</b> {selectedReport.reason || 'Not provided'}</p>
                <p><b>Reporter:</b> {selectedReport.user?.name || selectedReport.reporter?.name || 'Member'}</p>
                <p><b>Post creator:</b> {selectedReport.post?.user?.name || 'Not provided'}</p>
                <p><b>Post description:</b> {selectedReport.post?.description || 'Not provided'}</p>
                <p><b>Submitted:</b> {selectedReport.created_at ? new Date(selectedReport.created_at).toLocaleString() : 'Not provided'}</p>
              </div>
              <div className="mt-6 flex justify-end gap-2"><button onClick={() => rejectReport(selectedReport)} className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700">Reject</button><button onClick={() => resolveReport(selectedReport)} className="rounded-xl bg-leaf-600 px-4 py-2 text-sm font-bold text-white">Resolve report</button></div>
            </section>
          </div>
        )}
      </div>
    );
  }

  if (page === 'comments') {
    const filteredComments = adminComments.filter(c =>
      `${c.body || c.comment || ''} ${c.user?.name || ''} ${c.post?.title || ''}`
        .toLowerCase().includes(commentSearch.toLowerCase())
    );
    const deleteAdminComment = async (comment) => {
      if (!window.confirm('Delete this comment?')) return;
      try {
        await api.delete(`/admin/comments/${comment.id}`);
        setAdminComments(prev => prev.filter(c => c.id !== comment.id));
        flash('Comment deleted');
      } catch (e) {
        flash(e.response?.data?.message || 'Delete comment API is not available. Add DELETE /api/admin/comments/{id}.');
      }
    };
    return (
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-bold">Comments & feedback management</h2><p className="text-xs text-stone-400">{adminComments.length} comments loaded</p></div><input value={commentSearch} onChange={e => setCommentSearch(e.target.value)} placeholder="Search comment, member or recipe..." className="w-full max-w-sm rounded-xl border px-3 py-2 text-sm"/></div>
        {adminDataLoading ? <p className="py-10 text-center text-sm text-stone-400">Loading comments...</p> : adminDataError ? <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">{adminDataError}</p> : (
          <div className="space-y-3">{filteredComments.map(c => <article key={c.id} className="flex flex-wrap items-start justify-between gap-3 rounded-xl border p-4"><div className="min-w-0"><p className="font-semibold">{c.user?.name || 'Member'} <span className="font-normal text-stone-400">on {c.post?.title || 'Recipe'}</span></p><p className="mt-2 whitespace-pre-wrap text-sm text-stone-600">{c.body || c.comment || 'Empty comment'}</p><p className="mt-2 text-xs text-stone-400">{c.created_at ? new Date(c.created_at).toLocaleString() : 'Date unavailable'}</p></div><button onClick={() => deleteAdminComment(c)} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700"><Trash2 size={14} className="mr-1 inline"/>Delete</button></article>)}{filteredComments.length === 0 && <p className="py-8 text-center text-sm text-stone-400">No comments found.</p>}</div>
        )}
      </section>
    );
  }

  if (page === 'habits') {
    const filteredHabits = adminHabits.filter(h =>
      `${h.user?.name || ''} ${h.habit_name || h.habit_type || h.activity || ''} ${h.notes || ''}`
        .toLowerCase().includes(habitSearch.toLowerCase())
    );
    return (
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-bold">Daily habit tracking</h2><p className="text-xs text-stone-400">{adminHabits.length} habit records loaded</p></div><input value={habitSearch} onChange={e => setHabitSearch(e.target.value)} placeholder="Search member or habit..." className="w-full max-w-sm rounded-xl border px-3 py-2 text-sm"/></div>
        {adminDataLoading ? <p className="py-10 text-center text-sm text-stone-400">Loading habit records...</p> : adminDataError ? <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">{adminDataError}</p> : (
          <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-stone-50 text-stone-500"><tr><th className="p-3">Member</th><th className="p-3">Habit / Activity</th><th className="p-3">Value</th><th className="p-3">Date</th><th className="p-3">Notes</th></tr></thead><tbody>{filteredHabits.map(h => <tr key={h.id} className="border-b"><td className="p-3 font-semibold">{h.user?.name || 'Member'}</td><td className="p-3">{h.habit_name || h.habit_type || h.activity || 'Habit'}</td><td className="p-3">{h.value ?? h.amount ?? h.duration ?? '—'} {h.unit || ''}</td><td className="p-3 text-xs text-stone-500">{h.record_date || h.date || (h.created_at ? new Date(h.created_at).toLocaleDateString() : '—')}</td><td className="p-3 text-stone-500">{h.notes || '—'}</td></tr>)}</tbody></table>{filteredHabits.length === 0 && <p className="py-8 text-center text-sm text-stone-400">No habit records found.</p>}</div>
        )}
      </section>
    );
  }


  if (page === 'admin-notifications') {
    const sendAdminNotification = async (e) => {
      e.preventDefault();
      if (!notificationTitle.trim() || !notificationMessage.trim()) return;
      setSendingNotification(true);
      try {
        await api.post('/admin/notifications', {
          title: notificationTitle.trim(),
          message: notificationMessage.trim(),
          audience: notificationAudience
        });
        setNotificationTitle('');
        setNotificationMessage('');
        flash('Notification sent successfully');
      } catch (e) {
        flash(e.response?.data?.message || 'Send notification API is not available. Add POST /api/admin/notifications.');
      } finally {
        setSendingNotification(false);
      }
    };
    return (
      <section className="max-w-3xl rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-5"><h2 className="font-bold">Send community notification</h2><p className="text-xs text-stone-400">Create an announcement for all members or a selected audience.</p></div>
        <form onSubmit={sendAdminNotification} className="space-y-4">
          <label className="block text-sm font-semibold">Audience<select value={notificationAudience} onChange={e => setNotificationAudience(e.target.value)} className="mt-2 w-full rounded-xl border p-3 text-sm"><option value="all">All members</option><option value="active">Active members</option></select></label>
          <label className="block text-sm font-semibold">Notification title<input required maxLength={120} value={notificationTitle} onChange={e => setNotificationTitle(e.target.value)} placeholder="e.g. New healthy recipes this week" className="mt-2 w-full rounded-xl border p-3 text-sm"/></label>
          <label className="block text-sm font-semibold">Message<textarea required rows={5} maxLength={1000} value={notificationMessage} onChange={e => setNotificationMessage(e.target.value)} placeholder="Write your announcement..." className="mt-2 w-full rounded-xl border p-3 text-sm"/></label>
          <div className="flex justify-end"><button disabled={sendingNotification || !notificationTitle.trim() || !notificationMessage.trim()} className="inline-flex items-center gap-2 rounded-xl bg-leaf-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-50"><Send size={16}/>{sendingNotification ? 'Sending...' : 'Send notification'}</button></div>
        </form>
      </section>
    );
  }

  if (page === 'analytics') {
    const metricCards = [
      ['Total members', stats?.users ?? users.length, Users],
      ['Total recipes', stats?.posts ?? posts.length, Utensils],
      ['Total categories', stats?.categories ?? categories.length, Leaf],
      ['Pending reports', stats?.reports ?? reports.length, AlertTriangle],
      ['Total likes', stats?.likes ?? stats?.total_likes ?? '—', Heart],
      ['Total comments', stats?.comments ?? stats?.total_comments ?? '—', MessageSquare]
    ];
    return <div className="space-y-5"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{metricCards.map(([label, value, Icon]) => <div key={label} className="rounded-2xl bg-white p-5 shadow-sm"><Icon className="text-leaf-600"/><p className="mt-3 text-sm text-stone-500">{label}</p><b className="text-2xl">{value}</b></div>)}</div><div className="rounded-2xl bg-white p-5"><h2 className="font-bold">Analytics data availability</h2><p className="mt-2 text-sm leading-6 text-stone-500">This page displays real values returned by the Laravel /admin/stats endpoint. Likes and comments show a dash until the backend includes those aggregate fields. No sample statistics are generated.</p><button onClick={adminLoad} className="mt-4 rounded-xl border px-4 py-2 text-sm font-semibold">Refresh analytics</button></div></div>;
  }

  if (page === 'settings') {
    return <section className="max-w-2xl rounded-2xl bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><Settings className="text-leaf-600"/><div><h2 className="font-bold">Admin settings</h2><p className="text-xs text-stone-400">Current administrator account information</p></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border p-4"><p className="text-xs text-stone-400">Name</p><p className="mt-1 font-semibold">{users.find(u => u.role === 'admin')?.name || 'Administrator'}</p></div><div className="rounded-xl border p-4"><p className="text-xs text-stone-400">Role</p><p className="mt-1 font-semibold">Administrator</p></div></div><p className="mt-4 text-xs leading-5 text-stone-400">Password and security settings should be managed through the authenticated account/profile endpoints. No account credentials are displayed here.</p></section>;
  }

  if (page === 'categories') {
    const addCategory = async () => {
      const name = window.prompt('New category name');
      if (!name?.trim()) return;
      try { await api.post('/admin/categories', { name: name.trim() }); const r = await api.get('/categories'); setCategories(r.data.data || r.data); flash('Category created'); }
      catch (e) { flash(e.response?.data?.message || 'Could not create category'); }
    };
    const editCategory = async (c) => { const name = window.prompt('Edit category name', c.name); if (!name?.trim() || name.trim() === c.name) return; try { await api.put(`/admin/categories/${c.id}`, { name: name.trim() }); const r = await api.get('/categories'); setCategories(r.data.data || r.data); flash('Category updated'); } catch (e) { flash(e.response?.data?.message || 'Category update API is not available'); } };
    const deleteCategory = async (c) => {
      if (!window.confirm(`Delete category ${c.name}?`)) return;
      try { await api.delete(`/admin/categories/${c.id}`); const r = await api.get('/categories'); setCategories(r.data.data || r.data); flash('Category deleted'); }
      catch (e) { flash(e.response?.data?.message || 'Could not delete category. It may contain recipes.'); }
    };
    return <div className="rounded-2xl bg-white p-5"><div className="mb-4 flex items-center justify-between"><h2 className="font-bold">Food categories</h2><button onClick={addCategory} className="rounded-lg bg-leaf-600 px-3 py-2 text-xs font-bold text-white">+ Add category</button></div>{categories.map(c => <div key={c.id} className="flex items-center justify-between border-b py-3 text-sm"><span className="font-medium">{c.name}</span><div className="flex gap-3"><button onClick={() => editCategory(c)} className="text-blue-600">Edit</button><button onClick={() => deleteCategory(c)} className="text-rose-600">Delete</button></div></div>)}</div>;
  }

  const filteredPosts = posts.filter(p => `${p.title || ''} ${p.user?.name || ''}`.toLowerCase().includes(postSearch.toLowerCase()));
  return <div><div className="mb-4"><h2 className="text-xl font-extrabold">Food post management</h2><input value={postSearch} onChange={e => setPostSearch(e.target.value)} placeholder="Search recipe or creator..." className="mt-3 w-full max-w-md rounded-xl border p-3 text-sm" /></div><div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{filteredPosts.map(p => <RecipeCardComponent key={p.id} p={p} />)}</div>{filteredPosts.length === 0 && <p className="rounded-xl bg-white p-8 text-center text-sm text-stone-400">No posts found.</p>}</div>;
}

// ==========================================
// REUSABLE PAGINATION
// ==========================================

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="inline-flex items-center gap-1 rounded-xl border bg-white px-3 py-2 text-sm font-semibold text-stone-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft size={16} /> Previous
      </button>
      <span className="rounded-xl bg-leaf-50 px-4 py-2 text-sm font-bold text-leaf-700">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="inline-flex items-center gap-1 rounded-xl border bg-white px-3 py-2 text-sm font-semibold text-stone-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next <ChevronRight size={16} />
      </button>
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
  const [sortBy, setSortBy] = useState('latest');
  const [feedPage, setFeedPage] = useState(1);
  const FEED_PAGE_SIZE = 9;

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
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const isAdmin = user?.role === 'admin';

  useEffect(() => { setShowNotifications(false); }, [page]);

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
    setNotifications([]);
    setShowNotifications(false);
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
      console.error('AUTH ERROR:', e);
      console.error('AUTH RESPONSE:', e.response?.data);
      setError(
        e.response?.data?.message ||
        e.response?.data?.status ||
        Object.values(e.response?.data?.errors || {}).flat().join(' ') ||
        (e.response ? `Request failed (${e.response.status}). Check credentials and Laravel logs.` : 'Cannot connect to Laravel API. Check that php artisan serve is running and the API URL is correct.')
      );
    }
  };

  // ========================================
  // LOAD SAVED RECIPES
  // ========================================

  const loadSaved = async () => {
    try {
      const r = await api.get('/bookmarks');
      // Laravel may return a plain array or a paginated { data: [] } response.
      const rows = Array.isArray(r.data)
        ? r.data
        : Array.isArray(r.data?.data)
          ? r.data.data
          : [];

      setSaved(rows);
      return true;
    } catch (e) {
      console.error('Saved recipes error:', e.response?.status, e.response?.data || e);
      return false;
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

    const postId = p?.id ?? p?.post_id ?? p?.food_post_id ?? p?.post?.id;
    if (!postId) {
      console.error('Bookmark failed: recipe ID is missing.', p);
      flash('Could not save this recipe. Recipe ID is missing.');
      return;
    }

    try {
      const response = await api.post(`/posts/${postId}/bookmark`);
      const refreshed = await loadSaved();

      if (!refreshed) {
        flash('Bookmark request completed, but saved recipes could not be refreshed. Please check the API.');
        return;
      }

      flash(response.data?.saved
        ? 'Recipe saved successfully'
        : 'Removed from saved recipes');
    } catch (error) {
      console.error('Bookmark error:', error.response?.status, error.response?.data || error);
      flash(error.response?.data?.message || 'Could not update bookmark. Please sign in again and retry.');
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
    setFeedPage(1);
    const timer = setTimeout(() => {
      doSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, category]);

  // ========================================
  // MEMBER NOTIFICATIONS
  // ========================================

  const loadNotifications = async (showLoader = false) => {
    if (!user) return;
    if (showLoader) setNotificationsLoading(true);

    try {
      const r = await api.get('/notifications');
      const payload = r.data?.data ?? r.data?.notifications ?? r.data;
      setNotifications(Array.isArray(payload) ? payload : []);
    } catch (e) {
      console.error('Notifications loading failed:', e.response?.data || e);
    } finally {
      if (showLoader) setNotificationsLoading(false);
    }
  };

  const markNotificationRead = async notification => {
    if (!notification || notification.read_at || notification.read) return;

    try {
      await api.patch(`/notifications/${notification.id}/read`);
      const readAt = new Date().toISOString();
      setNotifications(prev => prev.map(n =>
        n.id === notification.id ? { ...n, read_at: readAt, read: true } : n
      ));
    } catch (e) {
      flash(e.response?.data?.message || 'Could not mark notification as read');
    }
  };

  const markAllNotificationsRead = async () => {
    const unread = notifications.filter(n => !n.read_at && !n.read);
    if (!unread.length) return;

    try {
      await api.patch('/notifications/read-all');
      const readAt = new Date().toISOString();
      setNotifications(prev => prev.map(n => ({ ...n, read_at: n.read_at || readAt, read: true })));
      flash('All notifications marked as read');
    } catch (e) {
      flash(e.response?.data?.message || 'Could not mark notifications as read');
    }
  };

  const openNotification = async notification => {
    await markNotificationRead(notification);
    setShowNotifications(false);

    const postId = notification?.data?.post_id || notification?.post_id;
    if (postId) {
      try {
        const response = await api.get(`/posts/${postId}`);
        setActive(response.data);
        setModal('detail');
      } catch (e) {
        console.error('Could not open notification post:', e.response?.data || e);
        flash('The related recipe could not be opened.');
      }
    } else {
      setPage('notifications');
    }
  };

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    loadNotifications(true);

    // Refresh unread notifications periodically while signed in.
    const timer = window.setInterval(() => loadNotifications(false), 30000);
    return () => window.clearInterval(timer);
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
        'manage-posts',
        'comments',
        'habits',
        'analytics',
        'admin-notifications',
        'settings'
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
        ['reports', 'Reports', AlertTriangle],
        
        
        
        
        ['notifications', 'Notifications', Bell],
        
      ]
    : [
        ['home', 'Home', Home],
        ['explore', 'Explore', Compass],
        ['saved', 'Saved recipes', Bookmark],
        ['profile', 'My Profile', User],
        ['notifications', 'Notifications', Bell]
      ];
      

  // ========================================
  // FILTER DISPLAYED RECIPES
  // ========================================

  const baseShown = page === 'saved' ? saved : page === 'my-posts' ? posts.filter(p => p.user_id === user?.id) : posts;
  const shown = [...baseShown].sort((a, b) => {
    if (sortBy === 'popular') return Number(b.likes_count || b.likes?.length || 0) - Number(a.likes_count || a.likes?.length || 0);
    if (sortBy === 'rating') return Number(b.average_rating || 0) - Number(a.average_rating || 0);
    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
  });

  const totalFeedPages = Math.max(1, Math.ceil(shown.length / FEED_PAGE_SIZE));
  const safeFeedPage = Math.min(feedPage, totalFeedPages);
  const paginatedShown = shown.slice(
    (safeFeedPage - 1) * FEED_PAGE_SIZE,
    safeFeedPage * FEED_PAGE_SIZE
  );

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
  

  if (isAdmin && page !== 'notifications') {
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
    } else if (page === 'profile') {

  mainContent = (
    <ProfilePanel
      user={user}
      setUser={setUser}
      flash={flash}
      posts={posts}
      openDetails={openDetails}
      toggleLike={toggleLike}
      toggleBookmark={toggleBookmark}
      openCreate={openCreate}
      removePost={removePost}
    />
  );

} else if (page === 'notifications') {

  mainContent = (
    <NotificationPanel
      items={notifications}
      loading={notificationsLoading}
      markAsRead={markNotificationRead}
      markAllAsRead={markAllNotificationsRead}
      openNotification={openNotification}
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

          {paginatedShown.map(p => (
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

        <Pagination
          page={safeFeedPage}
          totalPages={totalFeedPages}
          onChange={setFeedPage}
        />

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
              {page === 'saved'
                ? 'Save recipes you like and they will appear here.'
                : page === 'my-posts'
                  ? 'Share your first healthy recipe with the community.'
                  : 'Try another category or search keyword.'}
            </p>
          </div>
        )}
      </>
    );
  }

  // ========================================
  // STANDALONE AUTHENTICATION PAGE
  // ========================================

  if (!user && modal === 'auth') {
    return (
      <AuthModal
        auth={auth}
        setAuth={setAuth}
        authForm={authForm}
        setAuthForm={setAuthForm}
        submitAuth={submitAuth}
        error={error}
        setError={setError}
        close={() => { setModal(''); setError(''); }}
      />
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

              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="hidden rounded-xl border bg-white px-3 py-2 text-xs sm:block"><option value="latest">Latest</option><option value="popular">Most popular</option><option value="rating">Highest rated</option></select>
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
                    <button
                      type="button"
                      onClick={() => {
                        const next = !showNotifications;
                        setShowNotifications(next);
                        if (next) loadNotifications(true);
                      }}
                      className="relative rounded-full p-2 hover:bg-stone-100"
                      title="Notifications"
                      aria-label={`Notifications${notifications.filter(n => !n.read_at && !n.read).length ? `, ${notifications.filter(n => !n.read_at && !n.read).length} unread` : ''}`}
                    >
                      <Bell size={19} />
                      {notifications.filter(n => !n.read_at && !n.read).length > 0 && (
                        <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                          {notifications.filter(n => !n.read_at && !n.read).length > 99 ? '99+' : notifications.filter(n => !n.read_at && !n.read).length}
                        </span>
                      )}
                    </button>

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
      

      {/* NOTIFICATION SIDEBAR */}
      {showNotifications && (
        <>
          <button
            type="button"
            aria-label="Close notifications"
            onClick={() => setShowNotifications(false)}
            className="fixed inset-0 z-[90] bg-stone-950/30 backdrop-blur-[1px]"
          />
          <aside className="fixed right-0 top-0 z-[95] flex h-full w-full max-w-md flex-col border-l border-stone-100 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <h2 className="text-lg font-extrabold text-stone-900">Notifications</h2>
                <p className="text-xs text-stone-500">{notifications.filter(n => !n.read_at && !n.read).length} unread · {notifications.length} total</p>
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={markAllNotificationsRead} disabled={!notifications.some(n => !n.read_at && !n.read)} className="text-xs font-bold text-leaf-700 disabled:opacity-40">Mark all read</button>
                <button type="button" onClick={() => setShowNotifications(false)} aria-label="Close" className="rounded-full p-2 hover:bg-stone-100"><X size={18}/></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {notificationsLoading && notifications.length === 0 ? (
                <p className="p-8 text-center text-sm text-stone-400">Loading notifications...</p>
              ) : notifications.length ? notifications.map(n => {
                const data = n.data || {};
                const unread = !n.read_at && !n.read;
                return (
                  <article key={n.id} className={`mb-3 rounded-2xl border p-4 ${unread ? 'border-leaf-100 bg-leaf-50/70' : 'border-stone-100 bg-white'}`}>
                    <button type="button" onClick={() => openNotification(n)} className="block w-full text-left">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-bold text-stone-800">{data.title || n.title || 'NutriShare update'}</p>
                          <p className="mt-1 text-sm leading-6 text-stone-600">{data.message || n.message || data.body || 'You have a new notification.'}</p>
                          <p className="mt-2 text-[11px] text-stone-400">{n.created_at ? new Date(n.created_at).toLocaleString() : 'Date unavailable'}</p>
                          {(data.actor_name || data.post_title || data.type) && <p className="mt-2 text-xs text-stone-500">{[data.actor_name, data.post_title, data.type].filter(Boolean).join(' · ')}</p>}
                        </div>
                        <span className={`mt-1 shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${unread ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}`}>{unread ? 'Unread' : 'Read'}</span>
                      </div>
                    </button>
                    <details className="mt-3 rounded-xl bg-white/80 px-3 py-2">
                      <summary className="cursor-pointer text-xs font-bold text-leaf-700">View notification data</summary>
                      <div className="mt-2 space-y-1 text-xs text-stone-600">
                        <p><b>ID:</b> {n.id}</p>
                        <p><b>Type:</b> {n.type || data.type || 'Community activity'}</p>
                        <p><b>From:</b> {data.actor_name || data.user_name || '—'}</p>
                        <p><b>Recipe:</b> {data.post_title || data.recipe_title || '—'}</p>
                        <p><b>Created:</b> {n.created_at ? new Date(n.created_at).toLocaleString() : '—'}</p>
                        <pre className="max-h-36 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-stone-50 p-2 text-[10px]">{JSON.stringify(data, null, 2)}</pre>
                      </div>
                    </details>
                    {unread && <button type="button" onClick={() => markNotificationRead(n)} className="mt-2 text-xs font-bold text-leaf-700">Mark as read</button>}
                  </article>
                );
              }) : <div className="py-16 text-center"><Bell size={34} className="mx-auto text-stone-300"/><p className="mt-3 font-bold text-stone-700">No notifications yet</p><p className="mt-1 text-sm text-stone-400">Community activity will appear here.</p></div>}
            </div>
            <button type="button" onClick={() => { setShowNotifications(false); setPage('notifications'); loadNotifications(true); }} className="border-t px-5 py-4 text-center text-sm font-extrabold text-leaf-700 hover:bg-leaf-50">View all notifications <span aria-hidden="true">→</span></button>
          </aside>
        </>
      )}

      {/* NOTIFICATION */}

      {notice && (
        <div className="fixed bottom-5 left-1/2 z-[80] -translate-x-1/2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white">
          {notice}
        </div>
      )}

    </div>
  );
}