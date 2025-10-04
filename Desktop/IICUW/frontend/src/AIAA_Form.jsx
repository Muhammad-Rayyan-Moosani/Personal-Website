import React, { useMemo, useState } from 'react';

export default function AIAA_Form({ onSubmit }) {
  const [formData, setFormData] = useState({
    gender: '',
    currentReligion: '',
    currentReligionOther: '',
    faculty: '',
    interestInIslam: '',
    interestInCurrentFaith: '',
    boothLocation: '',
    boothLocationOther: '',
    duration: '',
    tookQuran: '',
    tookMaterials: '',
  });

  const scaleOptions = useMemo(
    () => [
      { value: '0', label: '0' },
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4' },
      { value: '5', label: '5' },
    ],
    []
  );

  function updateField(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...formData,
      interestInIslam: formData.interestInIslam === '' ? null : Number(formData.interestInIslam),
      interestInCurrentFaith:
        formData.interestInCurrentFaith === '' ? null : Number(formData.interestInCurrentFaith),
      submittedAt: new Date().toISOString(),
    };
    try {
      if (typeof onSubmit === 'function') {
        onSubmit(payload);
      } else {
        // Fallback: log to console so you can wire this up to your backend later
        // You can also replace this with a fetch() call to your API endpoint
        // fetch('/api/aiaa', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        //   .then(r => r.json())
        //   .then(console.log)
        //   .catch(console.error);
        // Temporary local persistence (optional):
        const existing = JSON.parse(localStorage.getItem('aiaa_submissions') || '[]');
        existing.push(payload);
        localStorage.setItem('aiaa_submissions', JSON.stringify(existing));
        // eslint-disable-next-line no-console
        console.log('AIAA submission', payload);
      }
      alert('Thanks! Your (optional) responses have been recorded locally.');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      alert('Something went wrong submitting the form. Please try again.');
    }
  }

  const styles = {
    page: {
      minHeight: '100vh',
      width: '100vw',
      background: '#eff8ff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'SF Pro Display', 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    },
    container: {
      width: '100%',
      maxWidth: '800px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
    },
    arabicText: {
      fontSize: '32px',
      fontWeight: 'normal',
      color: '#000000',
      marginBottom: '16px',
      textAlign: 'center',
    },
    header: {
      fontSize: '32px', // text-3xl
      fontWeight: 'normal',
      color: '#000000',
      marginBottom: '8px',
      textAlign: 'center',
    },
    subheader: {
      color: '#6b7280', // text-gray-600
      fontSize: '14px', // text-sm
      marginTop: '8px', // mt-2
      marginBottom: '40px',
      textAlign: 'center',
    },
    form: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px', // space-y-8
    },
    section: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      padding: '16px', // p-4
      border: 'none',
      margin: 0,
    },
    legend: {
      fontWeight: 'normal',
      fontSize: '18px', // text-lg
      color: '#000000',
      marginBottom: '8px',
      textAlign: 'center',
    },
    divider: {
      border: 'none',
      borderTop: '1px solid #d1d5db', // border-gray-300
      margin: '8px 0', // my-2
      width: '100%',
    },
    row: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px', // gap-4
      justifyContent: 'center',
      width: '100%',
      maxWidth: '100%',
    },
    scaleRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gap: '12px',
      width: '100%',
      maxWidth: '600px',
    },
    scaleItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
    },
    radioItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      color: '#1f2937', // text-gray-800
      fontSize: '16px', // text-base
    },
    input: {
      width: '100%',
      padding: '8px',
      borderRadius: '6px',
      border: 'none',
      fontSize: '14px',
      maxWidth: '500px',
    },
    radioInput: {
      appearance: 'none',
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      border: '2px solid #d1d5db',
      backgroundColor: 'white',
      cursor: 'pointer',
      position: 'relative',
    },
    radioInputChecked: {
      appearance: 'none',
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      border: '2px solid #d1d5db',
      backgroundColor: 'white',
      cursor: 'pointer',
      position: 'relative',
    },
    label: {
      fontWeight: 'normal',
      color: '#000000',
    },
    helper: {
      color: '#6b7280', // text-gray-600
      fontSize: '14px', // text-sm
      marginTop: '4px',
    },
    submit: {
      marginTop: '24px',
      padding: '12px 24px',
      background: '#0ea5e9',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'normal',
    },
    scaleEnds: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '14px', // text-sm
      color: '#6b7280', // text-gray-600
      marginBottom: '8px',
      maxWidth: '600px',
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.arabicText}>بسم الله الرحمن الرحيم</div>
        <h2 style={styles.header}>AIAA Initiative Form</h2>
        <p style={styles.subheader}>(None of the fields are required but please fill out as many as you can)</p>

        <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.section}>
          <h3 style={styles.legend}>Gender</h3>
          <hr style={styles.divider} />
          <div style={styles.row}>
            {['Male', 'Female'].map(option => (
              <label key={option} style={styles.radioItem}>
                <input
                  type="radio"
                  name="gender"
                  value={option}
                  checked={formData.gender === option}
                  onChange={e => updateField('gender', e.target.value)}
                  style={formData.gender === option ? styles.radioInputChecked : styles.radioInput}
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.legend}>Current Religion</h3>
          <hr style={styles.divider} />
          <div style={styles.row}>
            {[
              'Christian Protestant',
              'Christian Catholic',
              'Jewish',
              'Hindu',
              'Buddhist',
              'Agnostic',
              'Atheist',
              'Muslim',
              'Sikh',
              'Other',
            ].map(option => (
              <label key={option} style={styles.radioItem}>
                <input
                  type="radio"
                  name="currentReligion"
                  value={option}
                  checked={formData.currentReligion === option}
                  onChange={e => updateField('currentReligion', e.target.value)}
                  style={formData.currentReligion === option ? styles.radioInputChecked : styles.radioInput}
                />
                {option}
              </label>
            ))}
          </div>
          {formData.currentReligion === 'Other' && (
            <div style={{ marginTop: 8 }}>
              <input
                style={styles.input}
                type="text"
                placeholder="Please specify"
                value={formData.currentReligionOther}
                onChange={e => updateField('currentReligionOther', e.target.value)}
              />
              <div style={styles.helper}>Optional</div>
            </div>
          )}
        </div>

        <div style={styles.section}>
          <h3 style={styles.legend}>Faculty</h3>
          <hr style={styles.divider} />
          <div style={styles.row}>
            {['Engineering', 'Mathematics', 'Science', 'Arts', 'Health', 'Environment'].map(option => (
              <label key={option} style={styles.radioItem}>
                <input
                  type="radio"
                  name="faculty"
                  value={option}
                  checked={formData.faculty === option}
                  onChange={e => updateField('faculty', e.target.value)}
                  style={formData.faculty === option ? styles.radioInputChecked : styles.radioInput}
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.legend}>Interest In Islam</h3>
          <hr style={styles.divider} />
          <div style={styles.scaleEnds}>
            <span>Not Interested</span>
            <span>Very Interested</span>
          </div>
          <div style={styles.scaleRow}>
            {scaleOptions.map(o => (
              <label key={o.value} style={styles.scaleItem}>
                <input
                  type="radio"
                  name="interestInIslam"
                  value={o.value}
                  checked={formData.interestInIslam === o.value}
                  onChange={e => updateField('interestInIslam', e.target.value)}
                  style={formData.interestInIslam === o.value ? styles.radioInputChecked : styles.radioInput}
                />
                {o.label}
              </label>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.legend}>Interest In Current Faith</h3>
          <hr style={styles.divider} />
          <div style={styles.scaleEnds}>
            <span>Not Interested</span>
            <span>Very Interested</span>
          </div>
          <div style={styles.scaleRow}>
            {scaleOptions.map(o => (
              <label key={o.value} style={styles.scaleItem}>
                <input
                  type="radio"
                  name="interestInCurrentFaith"
                  value={o.value}
                  checked={formData.interestInCurrentFaith === o.value}
                  onChange={e => updateField('interestInCurrentFaith', e.target.value)}
                  style={formData.interestInCurrentFaith === o.value ? styles.radioInputChecked : styles.radioInput}
                />
                {o.label}
              </label>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.legend}>Booth Location</h3>
          <hr style={styles.divider} />
          <div style={styles.row}>
            {['SLC', 'STC', 'E7', 'DC', 'MC', 'SLC Green', 'Arts Quad', 'Hagey Hall', 'Rock Garden', 'Other'].map(
              option => (
                <label key={option} style={styles.radioItem}>
                  <input
                    type="radio"
                    name="boothLocation"
                    value={option}
                    checked={formData.boothLocation === option}
                    onChange={e => updateField('boothLocation', e.target.value)}
                    style={formData.boothLocation === option ? styles.radioInputChecked : styles.radioInput}
                  />
                  {option}
                </label>
              )
            )}
          </div>
          {formData.boothLocation === 'Other' && (
            <div style={{ marginTop: 8 }}>
              <input
                style={styles.input}
                type="text"
                placeholder="Please specify"
                value={formData.boothLocationOther}
                onChange={e => updateField('boothLocationOther', e.target.value)}
              />
              <div style={styles.helper}>Optional</div>
            </div>
          )}
        </div>

        <div style={styles.section}>
          <h3 style={styles.legend}>Duration of conversation</h3>
          <hr style={styles.divider} />
          <div style={styles.row}>
            {['1 minute or less', '1-5 minutes', '5-10 minutes', '10-15 minutes', '15-20 minutes', '20+ minutes'].map(
              option => (
                <label key={option} style={styles.radioItem}>
                  <input
                    type="radio"
                    name="duration"
                    value={option}
                    checked={formData.duration === option}
                    onChange={e => updateField('duration', e.target.value)}
                    style={formData.duration === option ? styles.radioInputChecked : styles.radioInput}
                  />
                  {option}
                </label>
              )
            )}
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.legend}>Did they take a copy of the Quran</h3>
          <hr style={styles.divider} />
          <div style={styles.row}>
            {['Yes', 'No'].map(option => (
              <label key={option} style={styles.radioItem}>
                <input
                  type="radio"
                  name="tookQuran"
                  value={option}
                  checked={formData.tookQuran === option}
                  onChange={e => updateField('tookQuran', e.target.value)}
                  style={formData.tookQuran === option ? styles.radioInputChecked : styles.radioInput}
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.legend}>Did they take some reading materials (besides the Quran)</h3>
          <hr style={styles.divider} />
          <div style={styles.row}>
            {['Yes', 'No'].map(option => (
              <label key={option} style={styles.radioItem}>
                <input
                  type="radio"
                  name="tookMaterials"
                  value={option}
                  checked={formData.tookMaterials === option}
                  onChange={e => updateField('tookMaterials', e.target.value)}
                  style={formData.tookMaterials === option ? styles.radioInputChecked : styles.radioInput}
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" style={styles.submit}>Submit</button>
      </form>
      </div>
    </div>
  );
}


