import { useMemo, useState, useEffect, Fragment } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FLOW_STEP_LABELS } from '../../../data/serviceData.jsx';
import { api } from '../../../utils/api.js';

// Helper to determine requirement availability dynamically from actual database documents
const getDynamicRequirementStatus = (service, userDocs) => {
  if (!service?.requirements || !service?.requirementKeys) return [];
  return service.requirements.map((req, i) => {
    const key = service.requirementKeys[i];
    // Case-insensitive check for uploaded document key
    const doc = userDocs.find(d => d.documentKey.toLowerCase() === key.toLowerCase());
    return {
      label: req,
      key,
      available: !!doc,
      doc: doc ? { fileName: doc.fileName || doc.documentName, fileUrl: doc.fileUrl } : null,
    };
  });
};

// ─── Step Indicator ────────────────────────────────────────────────────────────
const StepIndicator = ({ currentStep }) => {
  const steps = ['Persyaratan', 'Formulir', 'Konfirmasi'];
  return (
    <div className="flex items-center justify-center gap-0 mb-6">
      {steps.map((label, index) => {
        const stepNum = index + 1;
        const isDone = currentStep > stepNum;
        const isActive = currentStep === stepNum;
        return (
          <Fragment key={label}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
                  ${isDone ? 'bg-blue-600 border-blue-600 text-white' : ''}
                  ${isActive ? 'bg-blue-600 border-blue-600 text-white' : ''}
                  ${!isDone && !isActive ? 'bg-white border-gray-300 text-gray-400' : ''}`}
              >
                {isDone ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : stepNum}
              </div>
              <span className={`text-xs mt-1 font-medium ${isActive ? 'text-blue-600' : isDone ? 'text-blue-500' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`h-0.5 w-20 mb-4 mx-1 transition-all ${currentStep > stepNum ? 'bg-blue-600' : 'bg-gray-200'}`} />
            )}
          </Fragment>
        );
      })}
    </div>
  );
};

// ─── Step 1: Persyaratan (with auto-fill) ───────────────────────────────────────
const StepPersyaratan = ({ service, user, userDocs, onNext, onCancel }) => {
  const reqStatus = getDynamicRequirementStatus(service, userDocs);

  return (
    <div className="space-y-5">
      {/* Dokumen persyaratan with auto-fill status */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Dokumen Persyaratan</h3>
        <ul className="space-y-2.5">
          {reqStatus.map((req) => (
            <li key={req.key} className="flex items-start gap-3 text-sm">
              {req.available ? (
                <div className="shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              ) : (
                <div className="shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
              )}
              <div className="flex-1">
                <p className={`font-medium ${req.available ? 'text-gray-700' : 'text-gray-600'}`}>{req.label}</p>
                {req.available ? (
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-green-400 text-[9px] font-bold text-green-600 uppercase tracking-wide">
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      Ada di Profil
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">{req.doc.fileName}</span>
                  </div>
                ) : (
                  <div className="mt-1 flex flex-col items-start gap-1.5">
                    <p className="text-[10px] text-amber-600 font-medium">Perlu dilampirkan saat pengajuan</p>
                    {req.label.includes('Pernyataan') && (
                      <button className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded transition-colors">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        Unduh Template
                      </button>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Alur pengajuan - visual timeline */}
      <div className="bg-transparent border border-blue-200 rounded-lg px-4 py-3">
        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Alur Pengajuan</p>
        <div className="flex items-center flex-wrap gap-1">
          {(service.flowSteps ?? ['masyarakat', 'kaling', 'kelurahan']).map((step, i, arr) => (
            <Fragment key={step}>
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-transparent border border-blue-300 rounded text-[10px] font-bold text-blue-700">
                <span className="w-4 h-4 border border-blue-300 rounded-full flex items-center justify-center text-[8px] font-extrabold text-blue-650">{i + 1}</span>
                {FLOW_STEP_LABELS[step] || step}
              </span>
              {i < arr.length - 1 && (
                <svg className="w-3 h-3 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              )}
            </Fragment>
          ))}
        </div>
        {service.forwardTo && (
          <p className="text-[10px] text-blue-500 mt-2 font-medium">
            ※ Surat akan diteruskan ke <strong>{service.forwardTo}</strong> setelah diproses Kelurahan.
          </p>
        )}
        <div className="mt-2.5 pt-2 border-t border-blue-200/50">
          <p className="text-[10px] text-blue-600 font-medium flex items-start gap-1">
            <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <span className="leading-tight">Surat hasil akhir akan diterbitkan menggunakan <strong>Tanda Tangan Elektronik (TTE) / QR Code</strong> yang sah. Anda tidak perlu datang ke balai banjar atau kantor kelurahan untuk meminta tanda tangan basah.</span>
          </p>
        </div>
      </div>

      {/* Data pemohon (auto-fill) */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Data Pemohon</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">NIK</label>
            <input
              readOnly
              value={user?.nik || '—'}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 cursor-not-allowed"
            />
            <p className="text-xs text-blue-500 mt-1">* Auto terisi dari Profil Kependudukan Anda</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Nama Lengkap</label>
            <input readOnly value={user?.namaLengkap || user?.name || '—'} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Status Verifikasi Akun</label>
            <input readOnly value={user?.isVerified ? "AKTIF & TERVERIFIKASI" : "BELUM VERIFIKASI"} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-green-700 font-bold cursor-not-allowed" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button onClick={onCancel} className="px-5 py-2.5 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          Batal
        </button>
        <button onClick={onNext} className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
          Lanjut ke Langkah Berikutnya
        </button>
      </div>
    </div>
  );
};

// ─── Dynamic Form Field Renderer ─────────────────────────────────────────────────
const DynamicField = ({ field, value, onChange }) => {
  const baseClass = "w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  
  if (field.type === 'textarea') {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{field.label}</label>
        <textarea
          name={field.name}
          value={value}
          onChange={onChange}
          rows={3}
          placeholder={field.placeholder || ''}
          className={`${baseClass} resize-none`}
        />
      </div>
    );
  }
  if (field.type === 'select') {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{field.label}</label>
        <select
          name={field.name}
          value={value}
          onChange={onChange}
          className={`${baseClass} bg-white`}
        >
          <option value="">Pilih {field.label}</option>
          {(field.options || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
    );
  }
  // default: text, date
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{field.label}</label>
      <input
        type={field.type || 'text'}
        name={field.name}
        value={value}
        onChange={onChange}
        placeholder={field.placeholder || ''}
        className={baseClass}
      />
    </div>
  );
};

// ─── Step 2: Formulir (Dynamic fields) ──────────────────────────────────────────
const StepFormulir = ({ service, user, userDocs, formData, setFormData, onNext, onBack, files, setFiles, filePreviews, setFilePreviews }) => {
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const specificFields = service.specificFields || [];
  const reqStatus = getDynamicRequirementStatus(service, userDocs);
  const needsUpload = reqStatus.filter(r => !r.available);

  const handleNextClick = () => {
    // Check validation of general details
    const missingFields = [];
    if (!formData.tempatLahir) missingFields.push("Tempat Lahir");
    if (!formData.tanggalLahir) missingFields.push("Tanggal Lahir");
    if (!formData.pekerjaan) missingFields.push("Pekerjaan");
    if (!formData.alamat) missingFields.push("Alamat");

    // specific fields validation
    specificFields.forEach((field) => {
      if (!formData[field.name]) {
        missingFields.push(field.label);
      }
    });

    if (missingFields.length > 0) {
      alert(`Harap lengkapi kolom berikut: ${missingFields.join(", ")}`);
      return;
    }

    // Check files validation
    const missingFiles = needsUpload.filter(r => !files[r.key]);
    if (missingFiles.length > 0) {
      alert(`Harap unggah dokumen berikut: ${missingFiles.map(f => f.label).join(", ")}`);
      return;
    }

    onNext();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
        Data Umum Pemohon
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {/* NIK (readonly) */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">NIK (Nomor Induk Kependudukan)</label>
          <div className="relative">
            <input readOnly value={user?.nik || '—'} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 cursor-not-allowed pr-9" />
            <svg className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <p className="text-xs text-blue-500 mt-1">ⓘ Data terverifikasi dari profil kependudukan</p>
        </div>

        {/* Nama Lengkap */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Nama Lengkap</label>
          <input readOnly value={user?.namaLengkap || user?.name || '—'} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 cursor-not-allowed" />
        </div>

        {/* Tempat Lahir */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Tempat Lahir</label>
          <input name="tempatLahir" value={formData.tempatLahir} onChange={handleChange} placeholder="Denpasar" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        {/* Tanggal Lahir */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Tanggal Lahir</label>
          <input type="date" name="tanggalLahir" value={formData.tanggalLahir} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        {/* Jenis Kelamin */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2">Jenis Kelamin</label>
          <div className="flex gap-3">
            {['Laki-laki', 'Perempuan'].map((gender) => (
              <label key={gender} className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm cursor-pointer transition-all ${formData.jenisKelamin === gender ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                <input type="radio" name="jenisKelamin" value={gender} checked={formData.jenisKelamin === gender} onChange={handleChange} className="accent-blue-600" />
                {gender}
              </label>
            ))}
          </div>
        </div>

        {/* Agama */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Agama</label>
          <select name="agama" value={formData.agama} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="">Pilih Agama</option>
            {['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'].map(a => <option key={a}>{a}</option>)}
          </select>
        </div>

        {/* Pekerjaan */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Pekerjaan</label>
          <input name="pekerjaan" value={formData.pekerjaan} onChange={handleChange} placeholder="Karyawan Swasta" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      {/* Alamat */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Alamat Lengkap (Sesuai KTP)</label>
        <textarea name="alamat" value={formData.alamat} onChange={handleChange} rows={2} placeholder="Jl. Merdeka No. 10, Banjar Tegal, Kel. Panjer, Kec. Denpasar Selatan" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
      </div>

      {/* Dynamic service-specific fields */}
      {specificFields.length > 0 && (
        <div className="border-t border-gray-100 pt-4 space-y-4">
          <h3 className="text-sm font-bold text-gray-750 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            Detail Khusus: {service?.name}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {specificFields.map((field) => (
              <div key={field.name} className={field.type === 'textarea' ? 'col-span-2' : ''}>
                <DynamicField
                  field={field}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload dokumen (only for missing docs) */}
      <div className="border-t border-gray-100 pt-4">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" /></svg>
          Dokumen Lampiran
        </h3>

        {/* Auto-attached docs */}
        {reqStatus.filter(r => r.available).length > 0 && (
          <div className="mb-3 space-y-1.5">
            {reqStatus.filter(r => r.available).map((r) => (
              <div key={r.key} className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-medium text-green-700">{r.doc.fileName}</span>
                </div>
                <span className="text-[9px] font-bold text-green-600 uppercase">Auto-terlampir</span>
              </div>
            ))}
          </div>
        )}

        {/* Upload area for missing docs */}
        {needsUpload.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] text-amber-600 font-medium mb-2">Dokumen berikut perlu dilampirkan manual:</p>
            {needsUpload.map((r) => {
              const fileSelected = files[r.key];
              const preview = filePreviews[r.key];
              return (
                <div 
                  key={r.key} 
                  className="border border-gray-200 rounded-xl p-3 flex items-center gap-4 bg-gray-50/50 hover:bg-gray-50 transition-colors relative"
                >
                  <input
                    type="file"
                    id={`file-input-${r.key}`}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setFiles({ ...files, [r.key]: file });
                        if (file.type.startsWith("image/")) {
                          setFilePreviews({ ...filePreviews, [r.key]: URL.createObjectURL(file) });
                        } else {
                          setFilePreviews({ ...filePreviews, [r.key]: "pdf" });
                        }
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  
                  {!fileSelected ? (
                    <>
                      <div className="w-10 h-10 rounded-lg border border-dashed border-gray-300 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-gray-600">{r.label}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Klik untuk upload — JPG, PNG, PDF (maks. 5MB)</p>
                      </div>
                    </>
                  ) : (
                    <>
                      {preview && preview !== "pdf" ? (
                        <img src={preview} alt="Preview" className="w-16 h-12 object-cover rounded-lg border border-gray-300 shrink-0" />
                      ) : (
                        <div className="w-16 h-12 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-red-500">PDF</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-xs font-semibold text-gray-805 truncate">{r.label}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5 truncate">{fileSelected.name} ({(fileSelected.size / 1024).toFixed(0)} KB)</p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const newFiles = { ...files };
                            delete newFiles[r.key];
                            setFiles(newFiles);
                            const newPreviews = { ...filePreviews };
                            delete newPreviews[r.key];
                            setFilePreviews(newPreviews);
                          }}
                          className="mt-1 text-[9px] text-red-500 hover:text-red-700 font-bold transition-colors relative z-10"
                        >
                          Hapus & ganti
                        </button>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {needsUpload.length === 0 && (
          <p className="text-xs text-green-600 font-medium flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Semua dokumen sudah tersedia dari profil Anda!
          </p>
        )}
      </div>

      <div className="flex justify-between gap-3 pt-2">
        <button onClick={onBack} className="px-5 py-2.5 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          ← Kembali
        </button>
        <button onClick={handleNextClick} className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
          Lanjut ke Konfirmasi
        </button>
      </div>
    </div>
  );
};

// ─── Step 3: Konfirmasi ─────────────────────────────────────────────────────────
const SectionLabel = ({ icon, label }) => (
  <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
    {icon}
    {label}
  </div>
);

const Row = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
    <p className="text-sm font-medium text-gray-800">{value || '—'}</p>
  </div>
);

const StepKonfirmasi = ({ service, user, userDocs, formData, onSubmit, onBack, files, submitting, submitError }) => {
  const specificFields = service.specificFields || [];
  const reqStatus = getDynamicRequirementStatus(service, userDocs);

  return (
    <div className="space-y-5">
      {submitError && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
          {submitError}
        </div>
      )}

      {/* Data Pribadi */}
      <div className="border border-gray-200 rounded-xl p-5">
        <SectionLabel
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" /></svg>}
          label="Data Pribadi"
        />
        <div className="grid grid-cols-2 gap-y-4 gap-x-6">
          <Row label="NIK (Nomor Induk Kependudukan)" value={user?.nik || '—'} />
          <Row label="Nama Lengkap" value={user?.namaLengkap || user?.name || '—'} />
          <Row label="Tempat & Tanggal Lahir" value={formData.tempatLahir && formData.tanggalLahir ? `${formData.tempatLahir}, ${formData.tanggalLahir}` : '—'} />
          <Row label="Jenis Kelamin / Agama" value={`${formData.jenisKelamin || '—'} / ${formData.agama || '—'}`} />
          <Row label="Pekerjaan" value={formData.pekerjaan || '—'} />
          <div className="col-span-2">
            <Row label="Alamat Lengkap (Sesuai KTP)" value={formData.alamat || '—'} />
          </div>
        </div>
      </div>

      {/* Detail Khusus Pengajuan */}
      {specificFields.length > 0 && (
        <div className="border border-gray-200 rounded-xl p-5">
          <SectionLabel
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>}
            label={`Detail: ${service?.name}`}
          />
          <div className="grid grid-cols-2 gap-y-4 gap-x-6">
            {specificFields.map((field) => (
              <Row key={field.name} label={field.label} value={formData[field.name] || '—'} />
            ))}
          </div>
        </div>
      )}

      {/* Alur Pengajuan (Visual Timeline) */}
      <div className="border border-gray-200 rounded-xl p-5">
        <SectionLabel
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m0 0L14.25 6m6 6l-6 6" /></svg>}
          label="Alur Pemrosesan"
        />
        <div className="flex items-center flex-wrap gap-1.5">
          {(service.flowSteps ?? ['masyarakat', 'kaling', 'kelurahan']).map((step, i, arr) => (
            <Fragment key={step}>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-transparent border border-blue-300 rounded text-[10px] font-bold text-blue-700">
                <span className="w-4 h-4 border border-blue-300 rounded-full flex items-center justify-center text-[8px] font-extrabold text-blue-650">{i + 1}</span>
                {FLOW_STEP_LABELS[step] || step}
              </span>
              {i < arr.length - 1 && (
                <svg className="w-3 h-3 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              )}
            </Fragment>
          ))}
        </div>
      </div>

      {/* Dokumen Terlampir */}
      <div className="border border-gray-200 rounded-xl p-5">
        <SectionLabel
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>}
          label="Dokumen Terlampir"
        />
        <div className="grid grid-cols-2 gap-3">
          {reqStatus.map((r) => {
            const fileSelected = files[r.key];
            return (
              <div key={r.key} className="border border-gray-200 rounded-lg px-3 py-2.5 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700 truncate">
                  {r.available ? r.doc.fileName : (fileSelected ? fileSelected.name : r.label)}
                </span>
                <span className={`flex items-center gap-1 text-[10px] font-bold ${r.available || fileSelected ? 'text-green-600' : 'text-amber-600'}`}>
                  {r.available ? (
                    <>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      ADA DI PROFIL
                    </>
                  ) : (
                    fileSelected ? (
                      <>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        TERPILIH
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" /></svg>
                        MANUAL
                      </>
                    )
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between gap-3 pt-1">
        <button onClick={onBack} disabled={submitting} className="px-5 py-2.5 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
          ← Kembali
        </button>
        <button onClick={onSubmit} disabled={submitting} className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 disabled:bg-blue-300">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" /></svg>
          {submitting ? "Mengirim..." : "Kirim Pengajuan"}
        </button>
      </div>
    </div>
  );
};

// ─── Main Modal ─────────────────────────────────────────────────────────────────
const SubmissionModal = ({ service, user, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [files, setFiles] = useState({});
  const [filePreviews, setFilePreviews] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [userDocs, setUserDocs] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  // Fetch actual personal documents of logged in user from database
  useEffect(() => {
    const fetchUserDocs = async () => {
      try {
        const response = await api.get("/users/documents");
        setUserDocs(response.data.documents || []);
      } catch (err) {
        console.error("Gagal memuat dokumen user:", err);
      } finally {
        setLoadingDocs(false);
      }
    };
    fetchUserDocs();
  }, []);

  const currentStep = useMemo(() => {
    const rawStep = Number(searchParams.get("step") || 1);
    if (Number.isNaN(rawStep)) return 1;
    return Math.min(Math.max(rawStep, 1), 3);
  }, [searchParams]);

  const buildInitialFormData = () => {
    const base = {
      tempatLahir: user?.tempatLahir || "",
      tanggalLahir: user?.tanggalLahir || "",
      jenisKelamin: user?.jenisKelamin || "Laki-laki",
      agama: user?.agama || "",
      pekerjaan: user?.pekerjaan || "",
      alamat: user?.alamat || "",
    };

    (service?.specificFields || []).forEach((field) => {
      base[field.name] = "";
    });

    return base;
  };

  const [formData, setFormData] = useState(() => buildInitialFormData());

  const updateRoute = (updates, { replace = true } = {}) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });
    navigate({ search: next.toString() }, { replace });
  };

  const updateStep = (nextStep, options) => {
    updateRoute({ step: String(nextStep) }, options);
  };

  const handleClose = () => {
    onClose?.();
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");

    try {
      // Create submission
      const response = await api.post("/submissions", {
        serviceId: service.dbId || service.id,
        formData,
      });

      const submission = response.data.submission;

      // Upload each file
      for (const [key, fileObj] of Object.entries(files)) {
        const payload = new FormData();
        payload.append("file", fileObj);
        payload.append("documentKey", key);

        // Find label
        const keyIdx = service.requirementKeys.indexOf(key);
        const label = keyIdx !== -1 ? service.requirements[keyIdx] : key;
        payload.append("documentLabel", label);

        await api.post(`/submissions/${submission.id}/documents`, payload, true);
      }

      onSuccess?.();
      handleClose();
    } catch (err) {
      setSubmitError(err.message || "Gagal mengirimkan pengajuan surat.");
    } finally {
      setSubmitting(false);
    }
  };

  const stepTitles = {
    1: `Pengajuan ${service?.name}`,
    2: `Pengajuan ${service?.name}`,
    3: `Konfirmasi Pengajuan`,
  };

  const stepSubtitles = {
    1: 'Langkah 1 dari 3: Syarat & Data Awal',
    2: 'Langkah 2 dari 3: Isi Formulir',
    3: 'Langkah 3 dari 3: Verifikasi data akhir',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-7 pt-7 pb-5 border-b border-gray-100 shrink-0">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h2 className="text-base font-bold text-gray-900">{stepTitles[currentStep]}</h2>
              <p className="text-xs text-gray-400 mt-0.5">{stepSubtitles[currentStep]}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors ml-4 shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <StepIndicator currentStep={currentStep} />
        </div>

        {/* Body - scrollable */}
        <div className="overflow-y-auto flex-1 px-7 py-5">
          {loadingDocs ? (
            <div className="text-center py-12 text-xs text-gray-400 font-semibold flex flex-col items-center gap-2">
              <svg className="animate-spin w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Memverifikasi ketersediaan dokumen Anda...
            </div>
          ) : (
            <>
              {currentStep === 1 && (
                <StepPersyaratan service={service} user={user} userDocs={userDocs} onNext={() => updateStep(2)} onCancel={handleClose} />
              )}
              {currentStep === 2 && (
                <StepFormulir service={service} user={user} userDocs={userDocs} formData={formData} setFormData={setFormData} onNext={() => updateStep(3)} onBack={() => updateStep(1)} files={files} setFiles={setFiles} filePreviews={filePreviews} setFilePreviews={setFilePreviews} />
              )}
              {currentStep === 3 && (
                <StepKonfirmasi service={service} user={user} userDocs={userDocs} formData={formData} onSubmit={handleSubmit} onBack={() => updateStep(2)} files={files} submitting={submitting} submitError={submitError} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionModal;
