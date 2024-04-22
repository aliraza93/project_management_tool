<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ErrorController extends Controller
{
    public function forbidden()
    {
        return view('errors.403');
    }

    public function notFound()
    {
        return view('errors.404');
    }
    
    public function sendEmail()
    {
        $invoiceDetails = [
            'order_no' =>  1234,
            'package_id' => "NMP" . 220,
            'email' =>  'sk.hasan6310@gmail.com',
            'identity' => '201',
            'name' => 'Sk Abul Hasan',
            'old_package_bv' =>  1,
            'new_package_bv' =>  2,
            'package_name' =>  'Big',
            'quantity' => 1,
            'total_cost_bv' => 3,
            'subtotal_bv' => 4,
            'vat' => 5,
            'vat_rate' => 6,
            'bv_to_tk' => 7,
            'total_price' => 8,
            'order_date' => now(),
            'register_by' => 2,
            'title' => 'Package Purchase Challan',
            'newJointitle' => 'New Joinee',
            // 'password' => $request->password
            'password' => 987987987,
            'approved_by' => 'admin'
        ];

        Mail::send('user.mail.invoice-register-purchase', ['invoiceDetails' => $invoiceDetails], function ($invoiceDetailsMessage) use ($invoiceDetails) {
            $invoiceDetailsMessage->to($invoiceDetails['email'])->subject($invoiceDetails['title']);
        });
    }
}
