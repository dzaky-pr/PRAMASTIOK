'use client';

import * as React from 'react';
import { toast, ToastBar, Toaster, ToastOptions } from 'react-hot-toast';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { FaTimesCircle } from 'react-icons/fa';
import { HiInformationCircle, HiX } from 'react-icons/hi';
import { PiWarningFill } from 'react-icons/pi';
import { RiErrorWarningLine } from 'react-icons/ri';

export default function Toast() {
  return (
    <>
      <div>
        <Toaster
          reverseOrder={false}
          position='top-center'
          toastOptions={{
            style: {
              borderRadius: '4px',
              background: '#E8F0E0',
              color: '#8AB364',
            },
          }}
        >
          {(t) => (
            <ToastBar toast={t}>
              {({ icon, message }) => (
                <>
                  {icon}
                  {message}
                  {t.type !== 'loading' && (
                    <button
                      className='ring-primary-400 rounded-full p-1 text-black transition hover:text-[#444] focus:outline-none focus-visible:ring'
                      onClick={() => toast.dismiss(t.id)}
                    >
                      <HiX className='text-neutral-100' />
                    </button>
                  )}
                </>
              )}
            </ToastBar>
          )}
        </Toaster>
      </div>
    </>
  );
}

const DEFAULT_TOAST: ToastOptions = {
  style: {
    background: '#FFFFFF',
    color: '#9AA2B1',
  },
  icon: <RiErrorWarningLine />,
  className: 'w-[375px] [&>div]:justify-start',
  position: 'top-center',
  duration: 5000,
};

const createCustomToast = (options: ToastOptions) => {
  return { ...DEFAULT_TOAST, ...options };
};

const showToast = (message: string, options?: ToastOptions) => {
  return toast(message, options || DEFAULT_TOAST);
};

export { createCustomToast, showToast };

const INFO_TOAST = createCustomToast({
  style: {
    background: '#fff',
    color: '#52A7DD',
  },
  icon: <HiInformationCircle size={25} />,
  className: 'w-[375px] [&>div]:justify-start',
  position: 'top-center',
  duration: 5000,
});
const SUCCESS_TOAST = createCustomToast({
  style: {
    background: '#fff',
    color: '#6ABC90',
  },
  icon: <BsFillCheckCircleFill size={20} />,
  className: 'w-[375px] [&>div]:justify-start',
  position: 'top-center',
  duration: 5000,
});
const DANGER_TOAST = createCustomToast({
  style: {
    background: '#fff',
    color: '#D84A4D',
  },
  icon: <FaTimesCircle size={20} />,
  className: 'w-[375px] [&>div]:justify-start',
  position: 'top-center',
  duration: 5000,
});

const WARNING_TOAST = createCustomToast({
  style: {
    background: '#FFF',
    color: '#FEB100',
  },
  icon: <PiWarningFill size={20} />,
  className: 'w-[375px] [&>div]:justify-start',
  position: 'top-center',
  duration: 5000,
});

export { DANGER_TOAST, INFO_TOAST, SUCCESS_TOAST, WARNING_TOAST };
