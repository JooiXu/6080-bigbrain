import puppeteer from 'puppeteer';

jest.setTimeout(999999);

async function focusAndType (page, selector, text) {
  await page.focus(selector);
  await page.keyboard.type(text.toString());
}

describe('Admin happy path', () => {
  it('Admin happy path', async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const userid = (new Date()).getTime() + '@uitest.com';
    // 1. Registers successfully
    await page.goto('http://localhost:3000/register');
    await page.waitForSelector('input[name=name]');
    // fill in forms
    await focusAndType(page, 'input[name=name]', 'admin');
    await focusAndType(page, 'input[name=email]', userid);
    await focusAndType(page, 'input[name=password]', '123');
    await focusAndType(page, 'input[name=confirm]', '123');
    await page.click('button[type=submit]');
    await page.waitForNetworkIdle();
    expect(page.url()).toEqual('http://localhost:3000/admin/dashboard');

    // 2. Creates a new game successfully
    await page.click('a[href="/admin/quiz/new"]');
    await page.waitForNetworkIdle();
    await focusAndType(page, 'input[name=name]', 'game1');
    await page.click('button[type=submit]');
    await page.waitForNetworkIdle();
    expect(page.url()).toEqual('http://localhost:3000/admin/dashboard');
    expect((await page.$$('tbody tr')).length).toEqual(1);
    expect((await page.$$('.btn-start')).length).toEqual(1);
    expect((await page.$$('.btn-advance')).length).toEqual(0);
    expect((await page.$$('.btn-stop')).length).toEqual(0);

    // 3. (Not required) Updates the thumbnail and name of the game successfully (yes, it will have no questions)
    // 4. Starts a game successfully
    await page.click('.btn-start');
    await page.waitForNetworkIdle();
    expect((await page.$$('.btn-start')).length).toEqual(0);
    expect((await page.$$('.btn-advance')).length).toEqual(1);
    expect((await page.$$('.btn-stop')).length).toEqual(1);

    // 5. Ends a game successfully (yes, no one will have played it)
    await page.click('.btn-stop');
    await page.waitForNetworkIdle();
    expect((await page.$$('.btn-start')).length).toEqual(1);
    expect((await page.$$('.btn-advance')).length).toEqual(0);
    expect((await page.$$('.btn-stop')).length).toEqual(0);
    expect((await page.$$('.btn-result')).length).toEqual(1);

    // 6. Loads the results page successfully
    await page.click('.btn-result');
    await page.waitForNetworkIdle();
    expect(page.url().startsWith('http://localhost:3000/admin/result/')).toEqual(true);

    // 7. Logs out of the application successfully
    await page.click('.btn-logout');
    await page.waitForNetworkIdle();
    expect(page.url()).toEqual('http://localhost:3000/login');

    // 8. Logs back into the application successfully
    await focusAndType(page, 'input[name=email]', userid);
    await focusAndType(page, 'input[name=password]', '123');
    await page.click('button[type=submit]');
    await page.waitForNetworkIdle();
    expect(page.url()).toEqual('http://localhost:3000/admin/dashboard');

    await browser.close();
  });
});
